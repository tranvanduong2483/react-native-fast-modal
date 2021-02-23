import React, {PureComponent} from 'react';
import {Platform, Image} from 'react-native';
import FastImage from 'react-native-fast-image';

export class CustomFastImage extends PureComponent {
  state = {oriWidth: 1, oriHeight: 1, ratio: 1};

  render() {
    const {oriWidth, oriHeight, ratio} = this.state;
    const {style, source, ...props} = this.props;

    let {height, width} = style;

    if (height && !width) {
      width = height / ratio;
    } else if (!height && width) {
      height = width * ratio;
    } else if (!height && !width) {
      width = oriWidth;
      height = oriHeight;
    }

    width = Math.round(width);
    height = Math.round(height);

    return (
      <Image
        onLoad={(event) => {
          if (Platform.OS === 'android') {
            if (source?.uri) {
              Image.getSize(source.uri, (width, height) => {
                const oriWidth0 = width || 1;
                const oriHeight0 = height || 1;
                const ratio0 = oriHeight0 / oriWidth0;
                this.setState({
                  oriWidth: oriWidth0,
                  oriHeight: oriHeight0,
                  ratio: ratio0,
                });
              });
            } else {
              const {width, height} = Image.resolveAssetSource(source);

              const oriWidth0 = width || 1;
              const oriHeight0 = height || 1;
              const ratio0 = oriHeight0 / oriWidth0;
              this.setState({
                oriWidth: oriWidth0,
                oriHeight: oriHeight0,
                ratio: ratio0,
              });
            }
          } else {
            const oriWidth0 = event.nativeEvent.width || 1;
            const oriHeight0 = event.nativeEvent.height || 1;
            const ratio0 = oriHeight0 / oriWidth0;
            this.setState({
              oriWidth: oriWidth0,
              oriHeight: oriHeight0,
              ratio: ratio0,
            });
          }
        }}
        style={[
          style,
          {
            width,
            height,
          },
        ]}
        resizeMode={'contain'}
        source={source}
        {...props}
      />
    );
  }
}
