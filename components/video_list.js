'use strict';

import Search from 'react-native-search-box';
import {
    StyleSheet,
    View,
    Image,
    Text,
    ListView,
    TouchableHighlight,
  } from 'react-native';
import React, { Component } from 'react';
import youtubeSearch from '../youtube-api';
import VideoDetail from './video_detail';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#dddddd',
  },
  listView: {
    backgroundColor: 'yellow',
  },
});

class VideoList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: 'dog',
      isLoading: true,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    youtubeSearch(this.state.query)
       .then((responseData) => {
         this.setState({
           dataSource: this.state.dataSource.cloneWithRows(responseData),
           isLoading: false,
         });
       })
       .done();
  }

  showVideoDetail(video) {
    this.props.navigator.push({
      title: video.snippet.title,
      component: VideoDetail,
      passProps: { video },
    });
  }

  renderLoadingView() {
    console.log(this.state);
    return (
      <View style={styles.loading}>
        <Text>
            Loading videos...
        </Text>
      </View>
    );
  }

  renderVideo(video) {
    return (
      <TouchableHighlight onPress={() => { this.showVideoDetail(video); }} underlayColor="#dddddd">
        <View>
          <View style={styles.container}>
            <Image
              source={{ uri: video.snippet.thumbnails.default.url }}
              style={styles.thumbnail}
            />
            <View style={styles.rightContainer}>
              <Text style={styles.title}>{video.snippet.title}</Text>
              <Text style={styles.subtitle}>{video.snippet.description}</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    if (this.state.isLoading) {
      return this.renderLoadingView();
    }
    return (
      <View style={{ marginBottom: 150 }}>
        <Search
          onChangeText={(query) => {
            this.setState({ query });
            this.fetchData();
          }
          }
        />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={() => this.renderVideo}
          style={styles.listView}
        />
      </View>
    );
  }
}

module.exports = VideoList;
