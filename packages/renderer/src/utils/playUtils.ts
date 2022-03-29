import iinaImg from '/@/assets/images/player/iina.png';
import potplayerImg from '/@/assets/images/player/potplayer.png';
import vlcImg from '/@/assets/images/player/vlc.png';
import Cast2TvImg from '/@/assets/images/player/preview.png';
import StellarImg from '/@/assets/images/player/stellar.png';
// import ThunderImg from '/@/assets/images/player/preview.png';

export const srt2vtt = (s) =>
  'WEBVTT FILE\r\n\r\n' +
  s
    .replace(/\{\\([ibu])\}/g, '</$1>')
    .replace(/\{\\([ibu])1\}/g, '<$1>')
    .replace(/\{([ibu])\}/g, '<$1>')
    .replace(/\{\/([ibu])\}/g, '</$1>')
    .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
    .concat('\r\n\r\n');

export function players(url, title) {
  return [
    {
      name: 'IINA',
      icon: iinaImg,
      scheme: 'iina://weblink?url=' + url,
    },
    {
      name: 'PotPlayer',
      icon: potplayerImg,
      scheme: 'potplayer://' + url,
    },
    {
      name: 'VLC',
      icon: vlcImg,
      scheme: 'vlc://' + url,
    },
    {
      name: 'Cast2Tv',
      icon: Cast2TvImg,
      scheme:
        'intent:' + url + '#Intent;package=com.instantbits.cast.webvideo;S.title=' + title + ';end',
    },
    {
      name: '恒星播放器',
      icon: StellarImg,
      scheme: 'stellar://weblink?url=' + url,
    },
    // {
    //   name: 'Thunder',
    //   icon: ThunderImg,
    //   scheme: 'thunder://' + Buffer.from('AA' + url + 'ZZ').toString('base64'),
    // },
    // {
    //   name: 'nPlayer',
    //   icon: import('/@/assets/images/player/nplayer.png'),
    //   scheme: 'nplayer-' + url,
    // },
    // {
    //   name: 'MXPlayer(Free)',
    //   icon: import('/@/assets/images/player/mxplayer.png'),
    //   scheme:
    //     'intent:' + url + '#Intent;package=com.mxtech.videoplayer.ad;S.title=' + title + ';end',
    // },
    // {
    //   name: 'MXPlayer(Pro)',
    //   icon: import('/@/assets/images/player/mxplayer.png'),
    //   scheme:
    //     'intent:' + url + '#Intent;package=com.mxtech.videoplayer.pro;S.title=' + title + ';end',
    // },
  ];
}
