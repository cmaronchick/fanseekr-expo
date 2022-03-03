import React from "react";
import { Platform, StatusBar, View, TouchableOpacity } from "react-native";
import {
    createAppContainer,
    createSwitchNavigator
} from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Icon, Text } from 'react-native-elements';
import colors from './stylesheets/colors'
import globalStyles from "./stylesheets/globalStyles";

import Loading from "./components/Loading";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/LoginForm";
import ResetPassword from "./components/auth/ResetPassword";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import BlockedUserList from "./components/settings/BlockedUserList";
import ReportedUserList from "./components/admin/ReportedUserList";
import TeamSelect from './components/wizard/TeamSelect';
import Questionnaire from './components/wizard/Questionnaire';
import Survey from './components/wizard/Survey';
import TeamDashboard from './components/team/TeamDashboard';
import FanFinder from './components/team/FanFinder';
import BarFinder from './components/team/BarFinder';
import BarDetails from './components/team/BarDetails';
import TeamChat from './components/team/TeamChat';
import MyMessages from "./components/MyMessages";
import MyRoster from "./components/MyRoster";
import DirectMessage from "./components/DirectMessage";
import MyGroups from './components/groups/MyGroups'
import AllGroups from './components/groups/AllGroups'
import GroupDashboard from './components/groups/GroupDashboard'
import GroupRoster from './components/groups/GroupRoster'
import GroupSchedule from './components/groups/GroupSchedule'
import GroupChat from './components/groups/GroupChat'

import MyMessagesTabBar from "./components/tabbar/MyMessagesTabBar";

import { connect } from "react-redux";
import { setLastVisited } from "./actions/ChatActions";

const headerStyle = {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
};

const onLeaveChat = async (uid, roomName) => {
    console.log(`uid, roomName`, uid, roomName)
    await setLastVisited(uid, roomName)
}

const LoggedOutNavStack = createStackNavigator(
    {
        Login: {
            screen: Login,
            navigationOptions: {
                title: "Log In",
                headerStyle
            }
        },
        SignUp: {
            screen: SignUp,
            navigationOptions: {
                title: "Sign Up",
                headerStyle
            }
        },
        ResetPassword: {
            screen: ResetPassword,
            navigationOptions: {
                title: "Reset Password",
                headerStyle
            }
        }
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        },
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    }
);

const SignUpWizardStack = createStackNavigator(
    {
        TeamSelect: {
            screen: TeamSelect
        },
        Questionnaire: {
            screen: Questionnaire
        },
        Survey: {
            screen: Survey
        }
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    });

const homeStack = createStackNavigator(
    {
        Home: {
            screen: Home
        },
        Questionnaire: {
            screen: Questionnaire
        },
        Settings: {
            screen: Settings
        },
        BlockedUsersList: {
            screen: BlockedUserList
        },
        ReportedUserList: {
            screen: ReportedUserList
        },
        ProfileHome: {
            screen: Profile
        }
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    })

const groupsStack = createStackNavigator(
    {
        MyGroups: {
            screen: MyGroups
        },
        AllGroups: {
            screen: AllGroups
        },
        GroupRoster: {
            screen: GroupRoster
        },
        GroupSchedule: {
            screen: GroupSchedule
        },
        GroupChat: {
            screen: GroupChat
        },
        GroupDashboard: {
            screen: GroupDashboard
        }
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    })

const myRosterStack = createStackNavigator(
    {
        MyRoster: {
            screen: MyRoster
        },
        ProfileRoster: {
            screen: Profile
        },
        DirectMessageRoster: {
            screen: DirectMessage
        }
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    })

const myMessagesStack = createStackNavigator(
    {
        MyMessages: {
            screen: MyMessages
        },
        ProfileMyMessages: {
            screen: Profile
        },
        DirectMessageMyMessages: {
            screen: DirectMessage
        }
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    })


const teamStack = createStackNavigator(
    {
        TeamDashboard: {
            screen: TeamDashboard
        },
        FanFinder: {
            screen: FanFinder
        },
        BarFinder: {
            screen: BarFinder
        },
        BarDetails: {
            screen: BarDetails
        },
        TeamChat: {
            screen: TeamChat,
            navigationOptions: ({ navigation }) => {
                const { state } = navigation;
                const params = state.params || {};
                const uid = navigation.getParam('uid');
                const roomName = navigation.getParam('roomName')
                return {
                    headerTitle: (
                        <View style={{
                            flex: 1,
                            alignItems: 'center'
                        }} >
                            <Text>{params.chatTitle1}</Text>
                            <Text>{params.chatTitle2}</Text>
                        </View >
                    ),
                    headerRight: null,
                    headerLeft: (
                        <TouchableOpacity
                            onPress={async () => {
                                await setLastVisited(uid, roomName)
                                navigation.goBack()
                            }}
                            style={globalStyles.headerLeftButtonWrapper}
                        >
                            <Icon
                                name="arrow-back"
                                type="ionic"
                                color={colors.darkTxt}
                                size={22}
                            />
                        </TouchableOpacity>
                    ),
                    headerStyle: globalStyles.teamHeaderStyle
                }
            }
        },
        ProfileTeam: {
            screen: Profile
        },
        DirectMessageTeam: {
            screen: DirectMessage
        }
    },
    {
        defaultNavigationOptions: {
            gesturesEnabled: false,
        }
    })

class HomeScreen extends React.Component {
    UNSAFE_componentWillMount() {
        this.props.navigation.navigate('Home');
    }
    render() {
        return <View></View>;
    }
}
const TeamSelectedNavStack = createBottomTabNavigator(
    {
        Main: {
            screen: HomeScreen,
            navigationOptions: {
                tabBarLabel: "Home",
                tabBarIcon: ({ tintColor }) => <Icon name="home" size={24} color={tintColor} />
            }
        },
        TeamDashboard: {
            screen: teamStack,
            navigationOptions: {
                tabBarLabel: "Team Dashboard",
                tabBarIcon: ({ tintColor }) => <Icon name="flag" size={24} color={tintColor} />
            }
        },
        MyRoster: {
            screen: myRosterStack,
            navigationOptions: {
                tabBarLabel: "My Roster",
                tabBarIcon: ({ tintColor }) => <Icon name="users" type='font-awesome' size={22} color={tintColor} />
            }
        },
        Messages: {
            screen: myMessagesStack,
            navigationOptions: {
                tabBarLabel: "My Messages",
                tabBarIcon: ({ tintColor }) => <MyMessagesTabBar tintColor={tintColor} />
            }
        }
    },
    {
        tabBarOptions: {
            style: {
                borderTopColor: 'transparent',
                height: 60,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 0,
                paddingRight: 10,
                backgroundColor: 'white',
                shadowColor: colors.darkBg,
                shadowOffset: { width: .5, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 5
            },
            // other stuff unrelated:
            labelStyle: {
                marginTop: 0,
            },
            activeTintColor: colors.primary,
            inactiveTintColor: colors.darkTxt
        }
    }
);


const LoggedInNavStack = createBottomTabNavigator(
    {
        Home: {
            screen: homeStack,
            navigationOptions: {
                tabBarLabel: "Home",
                tabBarIcon: ({ tintColor }) => <Icon name="home" size={24} color={tintColor} />
            }
        },
        Groups: {
            screen: groupsStack,
            navigationOptions: {
                tabBarLabel: "Groups",
                tabBarIcon: ({ tintColor }) => <Icon name="group" size={24} color={tintColor} />
            }
        },
        MyRoster: {
            screen: myRosterStack,
            navigationOptions: {
                tabBarLabel: "My Roster",
                tabBarIcon: ({ tintColor }) => <Icon name="users" type='font-awesome' size={22} color={tintColor} />
            }
        },
        Messages: {
            screen: myMessagesStack,
            navigationOptions: {
                tabBarLabel: "My Messages",
                tabBarIcon: ({ tintColor }) => <MyMessagesTabBar tintColor={tintColor} />
            }
        }
    },
    {
        tabBarOptions: {
            style: {
                borderTopColor: 'transparent',
                height: 60,
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 0,
                paddingRight: 10,
                backgroundColor: 'white',
                shadowColor: colors.darkBg,
                shadowOffset: { width: .5, height: 1 },
                shadowOpacity: 0.3,
                shadowRadius: 2,
                elevation: 5
            },
            // other stuff unrelated:
            labelStyle: {
                marginTop: 0,
            },
            activeTintColor: colors.primary,
            inactiveTintColor: colors.darkBg
        }
    }
);

const createRootNavigator = () => {
    //must put all screens here to be exposed
    return createSwitchNavigator(
        {
            Loading: {
                screen: Loading
            },
            Wizard: {
                screen: SignUpWizardStack
            },
            LoggedIn: {
                screen: LoggedInNavStack
            },
            LoggedOut: {
                screen: LoggedOutNavStack
            },
            TeamSelectedNavStack: {
                screen: TeamSelectedNavStack
            }
        },
        {
            initialRouteName: "Loading"
        }
    );
};

const mapDispatchToProps = {
    setLastVisited
}

export const AppContainer = createAppContainer(createRootNavigator());
