import React from 'react';
import PropTypes from 'prop-types';
import {WebView} from 'react-native-webview';

export default function Repository({navigation}) {
  return (
    <WebView
      source={{uri: navigation.getParam('repository').html_url}}
      style={{flex: 1}}
    />
  );
}

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};

Repository.navigationOptions = ({navigation}) => ({
  title: navigation.getParam('repository').name,
});
