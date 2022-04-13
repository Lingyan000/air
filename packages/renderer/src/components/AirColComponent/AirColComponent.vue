<template>
  <component :is="currentColComponent"></component>
</template>

<script lang="ts">
  import { computed, defineComponent, provide, toRef } from 'vue';
  import { snakeCase } from 'lodash';
  import { airHomeComponentInjectionKey } from '/@/components/AirColComponent/interface';
  import Pic1 from './Pic1.vue';
  import Text5 from './Text5.vue';
  import Text3 from './Text3.vue';
  import Text2 from './Text2.vue';
  import Text1 from './Text1.vue';
  import TextCenter1 from './TextCenter1.vue';
  import Movie3 from './Movie3.vue';
  import Movie1VerticalPicBlur from './Movie1VerticalPicBlur.vue';
  import Icon2Round from './Icon2Round.vue';
  import Movie2 from './Movie2.vue';
  import BlankBlock from './BlankBlock.vue';
  import Avatar from './Avatar.vue';
  import Movie1 from './Movie1.vue';
  import Movie1LeftPic from './Movie1LeftPic.vue';
  import Movie1VerticalPic from './Movie1VerticalPic.vue';
  import IconSmall3 from './IconSmall3.vue';
  import LineBlank from './LineBlank.vue';
  import IconRoundSmall4 from './IconRoundSmall4.vue';
  import RichText from './RichText.vue';
  import ScrollButton from './ScrollButton.vue';
  import LongText from './LongText.vue';
  import Pic2 from './Pic2.vue';
  import Text4 from './Text4.vue';
  import Line from './Line.vue';
  import BigBlankBlock from './BigBlankBlock.vue';
  import X5WebviewSingle from './X5WebviewSingle.vue';

  export default defineComponent({
    name: 'AirColComponent',

    components: {
      air_pic_1: Pic1,
      air_long_text: LongText,
      air_text_5: Text5,
      air_text_3: Text3,
      air_text_2: Text2,
      air_text_1: Text1,
      air_text_4: Text4,
      air_text_center_1: TextCenter1,
      air_movie_3: Movie3,
      air_movie_1_vertical_pic_blur: Movie1VerticalPicBlur,
      air_icon_2_round: Icon2Round,
      air_movie_2: Movie2,
      air_blank_block: BlankBlock,
      air_avatar: Avatar,
      air_movie_1_vertical_pic: Movie1VerticalPic,
      air_movie_1: Movie1,
      air_movie_1_left_pic: Movie1LeftPic,
      air_icon_small_3: IconSmall3,
      air_line_blank: LineBlank,
      air_icon_round_small_4: IconRoundSmall4,
      air_rich_text: RichText,
      air_scroll_button: ScrollButton,
      air_pic_2: Pic2,
      air_line: Line,
      air_big_blank_block: BigBlankBlock,
      air_x_5_webview_single: X5WebviewSingle,
    },

    props: {
      colType: {
        type: String as () => ColType,
        default: 'movie_3',
      },
      picUrl: {
        type: String as () => string,
        default: '',
      },
      title: {
        type: String as () => string,
        default: '',
      },
      desc: {
        type: String as () => string,
        default: '',
      },
      url: {
        type: String as () => string,
        default: '',
      },
    },

    setup(props) {
      const currentColComponent = computed(() => {
        return 'air_' + snakeCase(props.colType);
      });

      provide(airHomeComponentInjectionKey, {
        titleRef: toRef(props, 'title'),
        urlRef: toRef(props, 'url'),
        picUrlRef: toRef(props, 'picUrl'),
        descRef: toRef(props, 'desc'),
      });
      return {
        currentColComponent,
      };
    },
  });
</script>
