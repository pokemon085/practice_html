//自訂 toast
import { createVNode, render } from 'vue';
import maskNotification from './maskNotification.vue';

let instance;

export const notify = (options) => {
    if (!instance) {
        // 建立 DOM 並掛載
        const container = document.createElement('div');
        document.body.appendChild(container);
        const vNode = createVNode(maskNotification);
        render(vNode, container);
        instance = vNode.component.exposed;
    }

    instance.createNotify(options);
};

export default notify;
