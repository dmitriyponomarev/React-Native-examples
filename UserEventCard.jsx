import React, { PureComponent } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import SvgLike from '../../components/svg/SvgLike';
import SvgLikeNew from '../../components/svg/SvgLikeNew';
import SvgCalendar from '../../components/svg/SvgCalendar';
import SvgUser from '../../components/svg/SvgUser';
import SvgEventGeo from '../../components/svg/SvgEventGeo';
import {
  setLike,
  removeLike,
  toggleSetLikeYourEvent,
  toggleRemoveLikeYourEvent,
  toggleSetLikeEvent,
  toggleRemoveLikeEvent,
} from '../../store/actions/eventsScreen/index';
import { toggleSetLikeNotYourEvent, toggleRemoveLikeNotYourEvent } from '../../store/actions';

import styles from './userEventScrenStyles';

const CREATED = 'Created';
const GOING = 'Going';

class UserEventCard extends PureComponent {

  formatDistance = (distance) => {
    const { user } = this.props;
    let dist = Number(distance.split(' ')[0]).toFixed(0);

    if (user.distance_unit === 'K') {
      if (dist > 1000) {
        dist /= 1000;
        dist = `${dist.toFixed(1)} km`;
      } else {
        dist += ' m';
      }
    }

    if (user.distance_unit === 'M') {
      if (dist > 1600) {
        dist /= 1600;
        dist = `${dist.toFixed(1)} mi`;
      } else {
        dist += ' m';
      }
    }

    return dist;
  };

  likeAction = (isLiked, id, mode, creator) => {
    const {
      setLike,
      removeLike,
      toggleSetLikeYourEvent,
      toggleRemoveLikeYourEvent,
      toggleSetLikeEvent,
      toggleRemoveLikeEvent,
      toggleSetLikeNotYourEvent,
      toggleRemoveLikeNotYourEvent,
      user,
    } = this.props;

    if (mode === 'Created Events') {
      if (user.id === creator) {
        if (isLiked) {
          removeLike(id);
          toggleRemoveLikeYourEvent(id);
        } else {
          setLike(id);
          toggleSetLikeYourEvent(id);
        }
      } else {
        if (isLiked) {
          removeLike(id);
          toggleRemoveLikeNotYourEvent(id);
        } else {
          setLike(id);
          toggleSetLikeNotYourEvent(id);
        }
      }
    }

    if (mode === 'Interesting Events') {
      if (isLiked) {
        removeLike(id);
        toggleRemoveLikeEvent(id);
      } else {
        setLike(id);
        toggleSetLikeEvent(id);
      }
    }
  };

  render() {
    const { data, currentMode } = this.props;
    const {
      id,
      title,
      creator,
      distance,
      likes_count: likesCount,
      is_liked_from_me: isLikedFromMe,
      location,
      start_date: startDate,
      end_date: endDate,
      number_of_participants: numberOfParticipants,
    } = data;
    const status = (currentMode === 'Created Events' ? CREATED : GOING);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderTitle}>
            <Text style={styles.cardHeaderTitleEventName}>{title}</Text>
            <TouchableOpacity
              style={styles.flexDirect}
              onPress={() => this.likeAction(isLikedFromMe, id, currentMode, creator.id)}
            >
              <Text style={styles.ratingText}>{likesCount}</Text>
              {isLikedFromMe ? <SvgLike/> : <SvgLikeNew/>}
            </TouchableOpacity>
          </View>
          <Text style={styles.cardHeaderEventPlace}>{location}</Text>
          <View style={styles.cardHeaderData}>
            <View style={styles.flexDirect}>
              <SvgCalendar/>
              <Text style={styles.cardHeaderDataTime}>
                {`${moment.utc(startDate).format('ddd, ha')} - ${moment.utc(endDate).format('ddd, ha')}`}
              </Text>
            </View>
            <View style={styles.flexDirect}>
              <SvgUser/>
              <Text style={styles.cardHeaderUsersCount}>{numberOfParticipants || 0}</Text>
            </View>
            <View>
              <Text style={status === 'CREATED' ? styles.createdText : styles.goingText}>
                {status}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.flexDirect}>
            {creator.avatar && <Image style={styles.cardFooterAvatar} source={{ uri: creator.avatar }}/>}
            <Text style={styles.cardFooterUserName}>{creator.full_name || ''}</Text>
          </View>
          <View style={styles.flexDirect}>
            <Text style={styles.cardFooterUserGeo}>
              {distance ? this.formatDistance(distance) : '10 mi away'}
            </Text>
            <SvgEventGeo/>
          </View>
        </View>
      </View>
    );
  }
}

UserEventCard.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    id: PropTypes.number,
    rating_of_price: PropTypes.number,
    location: PropTypes.string,
    number_of_participants: PropTypes.number,
    is_liked_from_me: PropTypes.bool,
    likes_count: PropTypes.number,
    distance: PropTypes.string,
    creator: PropTypes.shape({
      avatar: PropTypes.string,
      full_name: PropTypes.string,
      id: PropTypes.number,
    }),
    start_date: PropTypes.string.isRequired,
    end_date: PropTypes.string.isRequired,
  }).isRequired,
  currentMode: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    push: PropTypes.func,
  }).isRequired,
  user: PropTypes.shape({
    distance_unit: PropTypes.string,
    id: PropTypes.number,
  }).isRequired,
  setLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  toggleSetLikeYourEvent: PropTypes.func.isRequired,
  toggleRemoveLikeYourEvent: PropTypes.func.isRequired,
  toggleSetLikeEvent: PropTypes.func.isRequired,
  toggleRemoveLikeEvent: PropTypes.func.isRequired,
  toggleSetLikeNotYourEvent: PropTypes.func.isRequired,
  toggleRemoveLikeNotYourEvent: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  user: state.rootReducer.user,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  setLike,
  removeLike,
  toggleSetLikeYourEvent,
  toggleRemoveLikeYourEvent,
  toggleSetLikeEvent,
  toggleRemoveLikeEvent,
  toggleSetLikeNotYourEvent,
  toggleRemoveLikeNotYourEvent,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withNavigation(UserEventCard));
