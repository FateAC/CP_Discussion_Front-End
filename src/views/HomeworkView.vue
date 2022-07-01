
<template>
    <n-layout-content has-sider position="absolute">
        <two-block-comp>
            <template v-slot:top>
                <n-h2>this is top element</n-h2>
                <img width=300 src="https://static.popdaily.com.tw/u/202204/425de133-dae7-425f-852f-6b8fd03a030a.jpeg" />
            </template> 
            <template v-slot:bottom>
                <n-h2>this is bottom element</n-h2>
                <img src="https://upload.wikimedia.org/wikipedia/zh/thumb/b/ba/Nyan_cat_250px_frame.jpg/220px-Nyan_cat_250px_frame.jpg" />
            </template> 
        </two-block-comp>
    </n-layout-content>
</template>

<script setup lang="ts">
import TwoBlockComp from "~/components/TwoBlockComp.vue"
import { NLayoutContent, NH2} from "naive-ui"
</script>