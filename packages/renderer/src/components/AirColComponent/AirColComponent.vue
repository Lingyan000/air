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

  export default defineComponent({
    name: 'AirColComponent',

    components: {
      pic_1: Pic1,
      long_text: LongText,
      text_5: Text5,
      text_3: Text3,
      text_2: Text2,
      text_1: Text1,
      text_4: Text4,
      text_center_1: TextCenter1,
      movie_3: Movie3,
      movie_1_vertical_pic_blur: Movie1VerticalPicBlur,
      icon_2_round: Icon2Round,
      movie_2: Movie2,
      blank_block: BlankBlock,
      avatar: Avatar,
      movie_1_vertical_pic: Movie1VerticalPic,
      movie_1: Movie1,
      movie_1_left_pic: Movie1LeftPic,
      icon_small_3: IconSmall3,
      line_blank: LineBlank,
      icon_round_small_4: IconRoundSmall4,
      rich_text: RichText,
      scroll_button: ScrollButton,
      pic_2: Pic2,
      line: Line,
      big_blank_block: BigBlankBlock,
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
        return snakeCase(props.colType);
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
