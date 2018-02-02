import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components/native'
import { View, Dimensions, ToastAndroid } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import CardContent from 'src/components/CardContent'
import Indicator from 'src/components/Indicator'
import LoginForm from 'src/components/form/user';

import { loading } from 'src/store/indicator/action'
import delay from 'src/util/delay'
import app from 'src/util/feathers'

const { width, height } = Dimensions.get('window')

class SettingsScreen extends React.Component {
    state = {
        error: undefined
    }
    static propTypes = {
        navigation: PropTypes.object.isRequired
    }
    static navigationOptions = {
        tabBarLabel: 'Settings',
        tabBarIcon: ({ tintColor, focused }) => (
            <Ionicons
                name={focused ? 'ios-settings' : 'ios-settings-outline'}
                size={26}
                style={{ color: tintColor }}
            />
        ),
    };

    handleSubmit = (formValues, setSubmitting) => {

        console.log('FORM VALUES: ', formValues)
        const { email, password } = formValues
        const { navigation, loading } = this.props
        const userService = app.service('users')

        loading(true)
        return userService.create({ email, password })
            .then(res => {
                console.log('.then ', res)
                loading(false)
                // setSubmitting(false)
                // ToastAndroid.show(`Successfully created: ${res.email}!`, ToastAndroid.SHORT);
                navigation.navigate('Home')
            })
            .catch(error => {
                loading(false)
                // setSubmitting(false)
                this.setState({ error: error })
                // ToastAndroid.show('There was an error. Try again!', ToastAndroid.SHORT);
                console.log('.catch ', error)
            })

        // loading(true)
        // delay(7000)
        // .then(() => {
        //     loading(false)
        //     navigation.navigate('Home')
        // })
    }

    renderForm() {
        return <LoginForm handleSubmit={this.handleSubmit} />
    }
    renderError() {
        return (
            <ErrorContainer>
                <ErrorText>{this.state.error.message}</ErrorText>
            </ErrorContainer>
        )
    }

    render() {
        return (
            <View>
                {this.state.error ? this.renderError() : null}
                {this.props.indicator.active ? <Indicator /> : this.renderForm()}

            </View>
        )
    }
}

// class="w-90 ba br2 pa3 ma2 red bg-washed-red" role="alert"
const ErrorContainer = styled.View`
    backgroundColor: red;
    height: 70px;
    alignItems: center;
    justifyContent: center;
`
const ErrorText = styled.Text`
    fontSize: 22px;
    color: white;
`

const mapState = (state) => {
    return {
        indicator: state.indicator
    }
}

const mapAction = (dispatch) => ({
    loading: bindActionCreators(loading, dispatch)
})

export default connect(mapState, mapAction)(SettingsScreen)
