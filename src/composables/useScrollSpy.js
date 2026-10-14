
import { ref, onMounted, onUnmounted } from 'vue';
import { useScrollStore } from '@/stores/storeScroll';


export function useScrollSpy(targetIds = []) {
	const activeId = ref(null);
	const storeScroll = useScrollStore();

    const handleScroll = () => {
		
		let closestId = null;
		let closestDistance = Infinity;
		for (const id of targetIds) {
			const el = document.getElementById(id);
			if (el) {
				const rect = el.getBoundingClientRect();
				const distance = Math.abs(rect.top);
				if (distance < storeScroll.headerProfile?.offsetHeight) {
					closestDistance = distance;
					closestId = id;
				}
			}
		}
		activeId.value = closestId;    
    };

    onMounted(() => {
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll(); 
    });

    onUnmounted(() => {
      	window.removeEventListener('scroll', handleScroll);
    });

    return {
      	activeId,
    };
}
