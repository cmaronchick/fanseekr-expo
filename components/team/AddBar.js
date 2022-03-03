import React, { Component } from 'react'
import { View, Modal, ActivityIndicator } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Input, Button, Icon, Text } from 'react-native-elements'
import styles from '../../stylesheets/barFinderStyles'
import globalStyles from '../../stylesheets/globalStyles'
import colors from '../../stylesheets/colors'

import { connect } from 'react-redux'
import { generateRandomString } from '../../helpers/utils'

import firestore from '@react-native-firebase/firestore'

import { addBar } from '../../actions/BarActions'

class AddBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            phone: '',
            address: '',
            teams: '',
            website: '',
            formComplete: false,
            addingBar: false,
            addBarSuccess: false
        }
    }

    validateForm = () => {
        const {name, phone, address} = this.state
        if (name && phone && address) {
            this.setState({
                formComplete: true
            })
        }
    }

    updateBarInfo = (key, value) => {
        this.setState({
            [key]: value
        })
        this.validateForm()

    }

    clearBarInfo = () => {
        this.setState({
            name: '',
            phone: '',
            address: '',
            teams: '',
            website: ''
        })
    }

    submitBarInformation = async () => {
        this.setState({
            addingBar: true
        })
        let teams = this.state.teams && this.state.teams.length > 0 ? this.state.teams.split(',') : null
        const { name, phone, address, website } = this.state

        let uid = generateRandomString(20);
        try {
            let addResult = await firestore().collection('bars2').doc(uid).set({
                name,
                phone,
                address,
                website,
                teams: teams ? teams : '',
                status: 'suggested'
            })
            this.setState({
                addingBar: false,
                addBarSuccess: true
            })
            setTimeout(() => {
                this.clearBarInfo()
                this.props.toggleAddBarModalVisible()
            }, 1500)
        } catch (addBarError) {
            console.log(`addBarError`, addBarError)
        }


    }

    toggleAddBarModalVisible = () => {
        this.clearBarInfo()
        this.props.toggleAddBarModalVisible()
    }
    
    render() {
        const { name, phone, address, website, teams, formComplete, addBarSuccess, addingBar } = this.state
        return (

        <Modal
            animationType="slide"
            transparent
            visible={this.props.addBarModalVisible}>
                <View style={styles.modal}>
                <View style={[styles.guideModalWrapper, {height: 'auto'}]}>
                    <View style={[styles.guideRow, { backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={[styles.modalTitle, {color: '#fff', marginTop: 5, marginBottom: 5}]}>Add Your Bar Suggestion</Text>
                    </View>
                    <View style={styles.guideRow}>
                    <Icon
                        name="info"
                        type="font-awesome"
                        color={colors.purple}
                        size={18}
                    />
                    <Input
                        type="text"
                        name="name"
                        value={this.state.name}
                        onChangeText={(value) => this.updateBarInfo('name', value)}
                        placeholder="Name"/>
                    </View>
                    
                    <View style={styles.guideRow}>
                    <Icon
                        name="phone"
                        type="font-awesome"
                        color={colors.purple}
                        size={18}
                    />
                    <Input
                        type="text"
                        name="phone"
                        placeholder="###-###-####"
                        onChangeText={(value) => this.updateBarInfo('phone', value)}
                        value={this.state.phone} />
                    </View>
                    
                    <View style={styles.guideRow}>
                    <Icon
                        name="building"
                        type="font-awesome"
                        color={colors.purple}
                        size={18}
                    />
                    <Input
                        type="text"
                        name="address"
                        placeholder="Address"
                        onChangeText={(value) => this.updateBarInfo('address', value)}
                        value={this.state.address} />
                    </View>
                    
                    <View style={styles.guideRow}>
                    <Icon
                        name="desktop"
                        type="font-awesome"
                        color={colors.purple}
                        size={18}
                    />
                    <Input
                        type="text"
                        
                        name="website"
                        placeholder="Add the bar's website"
                        onChangeText={(value) => this.updateBarInfo('website', value.toLowerCase())}
                        value={this.state.website} />
                    </View>
                    
                    <View style={styles.guideRow}>
                    <Icon
                        name="group"
                        type="font-awesome"
                        color={colors.purple}
                        size={18}
                    />

                    <Input
                        type="text"
                        name="group"
                        placeholder="Teams, separated by comma"
                        onChangeText={(value) => this.updateBarInfo('teams', value)}
                        value={this.state.teams} />
                    </View>
                    <View 
                        style={[styles.guideRow, { justifyContent: 'space-evenly'}]}
                        >
                            {addBarSuccess && (<Icon name="check-circle" type="font-awesome" color={colors.primary} size={18} />)}
                            <Button
                            buttonStyle={{borderRadius: 10, backgroundColor: colors.primary}}
                            onPress={() => this.submitBarInformation()}
                            title="Submit"
                            titleStyle={{color: '#fff'}}
                            disabledStyle={{opacity: 0.5}}
                            disabledTitleStyle={{color: '#fff'}}
                            loading={addingBar}
                            disabled={addingBar || addBarSuccess || !formComplete}
                            linearGradientProps={{
                                colors: [colors.primary, colors.primaryDarker],
                                angle: 45,
                                useAngle: true}}
                            ViewComponent={LinearGradient}/>


                            <Button buttonStyle={{borderRadius: 10, backgroundColor: colors.secondary}}
                            onPress={this.toggleAddBarModalVisible}
                            title="Cancel"
                            disabled={this.state.addingBar} />
                        </View>
                </View>
                </View>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => ({
    user: state.user
})

const mapDispatchToProps = {
    addBar
}

export default connect(null, mapDispatchToProps)(AddBar)