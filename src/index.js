/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import firebase from 'react-native-firebase';
import Intercom from 'react-native-intercom';
import Button from './button';
import CustomSafeAreaView from './custom-safe-area';

const sendToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
        console.log(fcmToken);
        Intercom.sendTokenToIntercom(fcmToken);
    } else {
        // user doesn't have a device token yet
    }
}

// All Intercom object properties
const actions = [];
for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(Intercom))) {
    const intercomFunc = Intercom[name];
    if (!(intercomFunc instanceof Function) || name === 'constructor') continue;
    actions.push({ name, action: () => Intercom[name]().then(() => alert('Promise resolved')).catch((error) => alert(error)) })
}


const intercomActions = [
    { name: 'Display Messenger', action: async () => Intercom.displayMessenger().catch((error) => alert(error)) },
    { name: 'Message Composer with "hello"', action: () => Intercom.displayMessageComposerWithInitialMessage('hello').catch((error) => alert(error)) },
    { name: 'Help Center', action: () => Intercom.displayHelpCenter().catch((error) => alert(error)) },
    { name: 'Register Identified user', action: () => Intercom.registerIdentifiedUser({ userId: 'bob123' }).then(() => alert('Promise resolved')).catch((error) => alert(error)) },
    { name: 'Send Push token', action: () => sendToken().then(() => alert('Token sent')) },
    { name: 'Logout', action: () => Intercom.logout().then(() => alert('Logout Successful')).catch((error) => alert(error)) },
    { name: 'Log event', action: () => Intercom.logEvent('viewed_screen', { extra: 'metadata' }).then(() => alert('Event logged')).catch((error) => alert(error)) },
    { name: 'Set bottom padding', action: () => Intercom.setBottomPadding(64).then(() => alert('Bottom padding set')).catch((error) => alert(error)) },
    {
        name: 'Update user', action: () => Intercom.updateUser({
            // Pre-defined user attributes
            email: 'abc123@intercom.com',
            user_id: 'user_id123',
            name: 'your name',
            phone: '010-1234-5678',
            language_override: 'language_override',
            signed_up_at: 1005,
            unsubscribed_from_emails: true,
            companies: [{
                company_id: 'your company id',
                name: 'your company name'
            }],
            custom_attributes: {
                my_custom_attribute: 123
            },
        }).then(() => alert('User updated')).catch((error) => alert(error))
    }
]

export default class App extends Component {
    async componentDidMount() {
        try {
            await firebase.messaging().requestPermission();
        } catch (error) {
            console.log(error)
            // User has rejected permissions
        }
        this.messageListener = firebase.messaging().onMessage((message) => {
            // Process your message as required
            console.log('Message received', message);
        });
        this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            // Process your notification as required
            // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
            console.log('notification received', notification);
        });
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            // Process your notification as required
            console.log('notification received', notification);
        });
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification = notificationOpen.notification;
            console.log('notification received', notification);
        });
        Intercom.addEventListener(Intercom.Notifications.UNREAD_COUNT, this._onUnreadChange)
    }
    componentWillUnmount() {
        this.messageListener();
        this.notificationDisplayedListener();
        this.notificationListener();
        this.notificationOpenedListener();
        Intercom.removeEventListener(Intercom.Notifications.UNREAD_COUNT, this._onUnreadChange);
    }
    _onUnreadChange = ({ count }) => {
        alert('The count:' + count)
    }
    render() {
        return (
            <CustomSafeAreaView style={styles.container} topBackgroundColor='black'>
                <View style={styles.topView}><Text style={styles.title}>INTERCOM TESTER</Text></View>
                <ScrollView style={{ backgroundColor: 'white' }} contentContainerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{ fontSize: 16, textAlign: 'center', paddingBottom: 20 }}>Actions</Text>
                    {intercomActions.map(({ action, name }, i) => <Button key={i} onPress={action}><Text>{name}</Text></Button>)}
                </ScrollView>
            </CustomSafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topView: {
        height: 45,
        backgroundColor: 'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
});
