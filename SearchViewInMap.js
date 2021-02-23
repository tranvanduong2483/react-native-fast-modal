import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Platform,
  Animated,
  Easing,
  Keyboard,
} from 'react-native';

const {height, width} = Dimensions.get('window');

//Theme
import Colors from '@theme/Colors';

//CustomComponent
import {FastModal} from '@CustomComponent';

export class SearchViewInMap extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalHeight: 0,
      modalWidth: 0,
      detailViewHeight: 0,
      detailViewWidth: 0,
    };

    this.transitionFilterView = new Animated.Value(0);
    this.transitionDetailItemView = new Animated.Value(0);

    this.filterTranslateX = this.transitionFilterView.interpolate({
      inputRange: [0, 1],
      outputRange: [width, 0],
    });

    this.mainViewTranslateXWithFilter = this.transitionFilterView.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -width],
    });

    this.mainViewOpacity = this.transitionFilterView.interpolate({
      inputRange: [0, 0.49, 0.5, 1],
      outputRange: [1, 1, 0, 0],
    });

    this.mainViewTranslateXWithDetailView = this.transitionDetailItemView.interpolate(
      {
        inputRange: [0, 0.49, 0.5, 1],
        outputRange: [0, 0, -width, -width],
      },
    );

    this.detailViewOpacity = this.transitionDetailItemView.interpolate({
      inputRange: [0, 0.1, 0.9, 1],
      outputRange: [0, 0, 0, 1],
    });

    this.detailViewTranslateX = this.transitionDetailItemView.interpolate({
      inputRange: [0, 0.1, 1],
      outputRange: [-width, 0, 0],
    });

    this.modalHeight = 0;
    this.modalWidth = 0;

    this.translateY = this.transitionDetailItemView.interpolate({
      inputRange: [0, 1],
      outputRange: [0, height],
    });
  }

  componentDidMount() {
    const {modalRef} = this.props;
    modalRef(this);
  }
  componentWillUnmount() {
    const {modalRef} = this.props;
    modalRef(undefined);
  }

  componentDidUpdate() {
    console.log('SearchViewInMap (CustomComponent) - componentDidUpdate');
  }

  //Check status
  isShow = () => {
    return !!this._modal?.isShowModal();
  };

  //Event
  show = (callback) => {
    this._modal?.showModal(callback);
  };

  hide = (callback) => {
    this._modal?.hideModal(() => {
      this.closeFilterView();
      this.closeDetailView();

      if (callback) {
        callback();
      }
    });
  };

  //transition view event
  showFilterView = (callback) => {
    Animated.parallel([
      Animated.timing(this.transitionFilterView, {
        duration: 300,
        toValue: 1,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start(callback);
  };

  closeFilterView = (callback) => {
    Animated.parallel([
      Animated.timing(this.transitionFilterView, {
        duration: 300,
        toValue: 0,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start(callback);
  };

  showDetailView = (callback) => {
    Animated.parallel([
      Animated.timing(this.transitionDetailItemView, {
        duration: 800,
        toValue: 1,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start(callback);
  };

  closeDetailView = (callback) => {
    Animated.parallel([
      Animated.timing(this.transitionDetailItemView, {
        duration: 600,
        toValue: 0,
        useNativeDriver: true,
        easing: Easing.out(Easing.exp),
      }),
    ]).start(callback);
  };

  render() {
    this.translateY = this.transitionDetailItemView.interpolate({
      inputRange: [0, 1],
      outputRange: [0, this.state.modalHeight - this.state.detailViewHeight],
    });

    return (
      <FastModal
        modalRef={(ref) => {
          this._modal = ref;
        }}
        onWillShow={this.props.onWillShow}
        onWillHide={this.props.onWillHide}
        translateY={this.translateY}
        style={this.props.style}>
        <Animated.View
          style={[
            styles.subContainer,

            {
              opacity: this.mainViewOpacity,
              transform: [
                {translateX: this.mainViewTranslateXWithFilter},
                {translateX: this.mainViewTranslateXWithDetailView},
              ],
            },
          ]}
          onLayout={(e) => {
            this.modalHeight = e.nativeEvent.layout.height;
            this.modalWidth = e.nativeEvent.layout.width;
            this.setState({
              modalHeight: this.modalHeight,
              modalWidth: this.modalWidth,
            });
          }}>
          {this.props.renderMainView}
        </Animated.View>

        <Animated.View
          style={[
            styles.subContainer,
            {transform: [{translateX: this.filterTranslateX}]},
          ]}>
          {this.props.renderFilterView}
        </Animated.View>

        <Animated.View
          style={{
            opacity: this.detailViewOpacity,
            transform: [{translateX: this.detailViewTranslateX}],
          }}
          onLayout={(e) => {
            this.setState({
              detailViewHeight: e.nativeEvent.layout.height,
              detailViewWidth: e.nativeEvent.layout.width,
            });
          }}>
          {this.props.renderDetailItem}
        </Animated.View>
      </FastModal>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    top: 0,
  },
});
