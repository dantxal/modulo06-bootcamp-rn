/* eslint-disable react/static-property-placement */
import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Bio,
  Name,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      navigation: props.navigation,
      stars: [],
      loading: false,
      isRefreshing: false,
      page: 1,
    };
  }

  async componentDidMount() {
    this.setState({loading: true});

    this.setStars();
  }

  setStars = async (page = 1) => {
    const {stars} = this.state;
    const {navigation} = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {page},
    });
    if (response.data.length < 1) {
      this.setState({isRefreshing: false, loading: false, page: 1});
      return;
    }
    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      isRefreshing: false,
      loading: false,
    });
  };

  handleRefresh = () => {
    this.setState({isRefreshing: true, page: 1}, this.setStars);
  };

  loadMore = () => {
    const {page} = this.state;
    const nextPage = page + 1;
    this.setState({page: nextPage});
    this.setStars(nextPage);
  };

  handleNavigate = repository => {
    console.tron.log('handling navigate');
    const {navigation} = this.props;

    navigation.navigate('Repository', {repository});
  };

  render() {
    const {navigation} = this.props;
    const {stars, loading, isRefreshing} = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {loading ? (
          <Loading>
            <ActivityIndicator color="#7159c1" size="large" />
          </Loading>
        ) : (
          <Stars
            refreshing={isRefreshing}
            onRefresh={this.handleRefresh}
            data={stars}
            keyExtractor={star => String(star.id)}
            onEndReachedThreshhold={0.2}
            onEndReached={this.loadMore}
            renderItem={({item}) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
