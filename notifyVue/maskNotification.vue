<template>
    <div v-if="showMask" :class="['mask-notify-wrap-mask']" :style="{ maskStyle }">
        <div class="mask-notify-wrap">
            <div class="message-container">
                <div
                    v-for="(item) in content"
                    :key="item.id"
                    :class="['message', selectType(item.type)]"
                >
                    <div @click="remove(item.id)">x</div>
                    <strong>{{ item.title }}</strong>
                    <p>{{ item.message }}</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, nextTick } from 'vue';

const content = ref([]);
const showMask = ref(false);

const selectType = (key) => {
    switch (key) {
        case 'error':
            return 'is-danger';
        case 'success':
            return 'is-success';
        case 'info':
            return 'is-info';
        default:
            return 'is-success';
    }
};

const maskStyle = computed(() => {

});

const remove = (id) => {
    const index = content.value.findIndex((item) => item.id === id);
    if (index !== -1) {
        content.value.splice(index, 1);
    }

    if (content.value.length === 0) {
        showMask.value = false;
    }
};

const createNotify = async (params) => {
    showMask.value = true;
    const id = Date.now() + Math.random();
    const item = {
        ...params,
        id,
    };

    await nextTick();
    content.value.unshift(item);

    if (+params.duration !== 0) {
        setTimeout(() => {
            remove(id);
        }, +params.duration);
    }
};

defineExpose({ createNotify });
</script>
<style lang="scss" scoped>

.mask-notify-wrap-mask{
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index:var(--notification-zindex);
    background: rgba(0, 0, 0, 0.2);
    // backdrop-filter:blur(3px)
}

.mask-notify-wrap {
    position: absolute;
    top: 20px;
    right: 20px;
    pointer-events: none;
}

.message-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  background: white;
  color: black;
  padding: 10px;
  border-left: 5px solid;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  pointer-events: all;
}

.is-success { border-color: #67c23a; }
.is-danger  { border-color: #f56c6c; }
.is-info    { border-color: #909399; }
</style>
