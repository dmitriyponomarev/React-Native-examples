import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {
  Header,
  SubHeader,
  AmountOfConnections,
  ConnectionAccepted,
  ConnectionRequestsBlock,
  LoadingScreen,
} from '../../components';
import {
  getMyConnectionsAction,
  getReceivedConnectionsAction,
} from '../../store/actions/connections';
import { directoryOpenAction } from '../../store/actions/directory';
import { Button } from '../../components/_core';
import { getChannelsAction } from '../../store/actions/messages';
import { User } from '../../store/models';

import { theme } from '../../styles';

// styles
const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    backgroundColor: theme.secondaryLightBackground,
  },
  container: {
    backgroundColor: theme.secondaryLightBackground,
  },
  buttonWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
// redux
const mapStateToProps = state => ({
  myConnections: state.connections.myConnections,
  receivedConnections: state.connections.receivedConnectionsList,
  isMyConnectionsLoading: state.connections.isMyConnectionsLoading,
  isReceivedConnectionsLoading: state.connections.isReceivedConnectionsLoading,
});
const mapDispatchToProps = {
  getMyConnections: getMyConnectionsAction,
  getReceived: getReceivedConnectionsAction,
  getChannelList: getChannelsAction,
  openDirectory: directoryOpenAction,
};

class Connections extends PureComponent {
  static propTypes = {
    getMyConnections: PropTypes.func.isRequired,
    getChannelList: PropTypes.func.isRequired,
    getReceived: PropTypes.func.isRequired,
    openDirectory: PropTypes.func.isRequired,
    myConnections: PropTypes.arrayOf(PropTypes.instanceOf(User)).isRequired,
    receivedConnections: PropTypes.arrayOf(PropTypes.instanceOf(User)).isRequired,
    isMyConnectionsLoading: PropTypes.bool.isRequired,
    isReceivedConnectionsLoading: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    const {
      getMyConnections, getReceived,
      getChannelList,
    } = this.props;
    getMyConnections();
    getChannelList();
    getReceived();
  }

  findMembers = () => {
    const { openDirectory } = this.props;
    openDirectory({ isBusiness: false });
  };

  render() {
    const {
      myConnections,
      receivedConnections,
      isMyConnectionsLoading,
      isReceivedConnectionsLoading,
    } = this.props;

    const isConnectionsNotEmpty = myConnections.length > 0;

    if (isMyConnectionsLoading || isReceivedConnectionsLoading) {
      return <LoadingScreen/>;
    }

    return (
      <View style={styles.topContainer}>
        <Header/>
        <ScrollView contentContainerStyle={styles.container}>
          <SubHeader title="Connections" titleFontSize={27}/>
          {
            isConnectionsNotEmpty && (
              <View>
                <AmountOfConnections myConnections={myConnections}/>
                <ConnectionAccepted data={myConnections}/>
              </View>
            )
          }
          <ConnectionRequestsBlock receivedConnections={receivedConnections}/>
          <View style={styles.buttonWrapper}>
            <Button
              text="Find Members"
              handleClick={this.findMembers}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
