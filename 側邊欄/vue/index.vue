<!-- // 側邊欄 -->

<template>
    <XyzTransition xyz="fade-100%">
        <div v-show="isOpen" class="drawer-mask" @click.stop="handleClose">
            <XyzTransition xyz="right-100%">
                <div
                    v-if="isOpen"
                    :id="id"
                    :style="{ width: size }"
                    class="drawer-wrap"
                    @click.stop
                >
                    <div class="drawer-header" :style="{ width: size }">
                        <div class="item">
                            <!-- 標題 -->
                            <div class="title">
                                {{ (title) }}
                            </div>

                            <slot name="header" />
                            <!-- 返回鍵 -->
                            <div class="left" @click="handleClose">
                                <i class="back-icon mdi mdi-18px mdi-close" />
                            </div>
                        </div>
                        <slot name="drawer-header-more" />
                    </div>
                    <div v-if="show" :id="`${id}-content`" class="drawer-content">
                        <div class="content" :style="{ width: `calc(${size} - 8px)` }">
                            <slot />
                        </div>
                    </div>
                </div>
            </XyzTransition>
        </div>
    </XyzTransition>
</template>

<script setup>
import {
    nextTick, watch, onUnmounted, ref,
} from 'vue';

/**
 * 共用-側邊欄
 * 開始滑才會出現scrollbar
 */
defineOptions({
    name: 'drawerIndex',
});

const emit = defineEmits(['close']);
const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    id: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        default: '800px',
    },
    title: {
        type: String,
        default: '',
    },
});

const idElement = ref(null);

/**
 * 關閉百寶箱
 */
const handleClose = () => {
    emit('close');
};

const scrollFunction = () => {
    if (!(idElement.value.scrollTop > 0)) {
        idElement.value.classList.add('scrollbar-hide');
    } else {
        idElement.value.classList.remove('scrollbar-hide');
    }
};

const setScrollElement = () => {
    idElement.value = document.querySelector(`#${props.id}-content`) || null;

    if (idElement.value !== null) {
        scrollFunction();
        idElement.value.addEventListener('scroll', scrollFunction);
    }
};

const clearScrollElement = () => {
    if (idElement.value) {
        idElement.value.classList.remove('scrollbar-hide');
        idElement.value.removeEventListener('scroll', scrollFunction);
        idElement.value = null;
    }
};

const show = ref(false);
watch(() => props.isOpen, async (newValue) => {
    await nextTick();
    show.value = true;
    await nextTick();
    if (newValue) {
        setScrollElement();
    } else {
        clearScrollElement();
    }
}, { immediate: true });

onUnmounted(() => {
    clearScrollElement();
    show.value = false;
});
</script>

<style lang="scss" scoped>
$header-background: #fff;
$title-color: var(--main_text_medium_bright_color);

.drawer-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2012;
    height: 100%;
    background-color: rgba(0, 0, 0, .5);

}

.drawer-wrap {
    width: 80%;
    height: 100%;
    background-color: $header-background;
    position: absolute;
    right: 0;
    box-shadow: -12px 0px 32px 4px rgba(0, 0, 0, 0.04), -8px 0px 20px 0px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
}

.drawer-header {
    background-color: $header-background;
    padding: 20px 20px 10px 20px;

    .item {
        display: flex;
        align-items: center;

        .left {
            margin-left: auto;
            align-self: flex-start;

            .back-icon {
                color: #606266;
                cursor: pointer;
            }

        }

        .title {
            font-size: 16px;
            font-weight: 500;
            color: $title-color;
            margin-right: 16px;
            display: inline-flex;
        }

    }
}

.drawer-content {

    margin-right: 3px;
    flex: 1;
    overflow-y: auto;

    /* 捲軸寬度及高度 */
    &::-webkit-scrollbar {
        width: 5px;
        /*右側捲軸寬度*/
    }

    /* 軌道背景底色 */
    &::-webkit-scrollbar-thumb {
        background: #E4E7ED;
        border-radius: 21px;
    }

}

.content {
    //12px 扣掉scrollbar width:5px跟margin-right:3px
    padding: 20px 12px 20px 20px;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    /* Internet Explorer 10+ */
    scrollbar-width: none;
    /* Firefox */

    &::-webkit-scrollbar {
        display: none;
        /* Safari and Chrome */
    }

}
</style>




