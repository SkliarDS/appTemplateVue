import { ref } from "vue";
import { useRequestsStore } from '@/stores/storeRequests';
import { useSettingsStore } from '@/stores/storeSettings';
import { sendMetrik } from '@/utils/metrika'
import { useRouter } from "vue-router";

let modalsInstance; 

export const useModals = () => {

    if (modalsInstance) {
        return modalsInstance;
    }

    const activeModal = ref(false);
    const modalId = ref(null);    
    const modalContent = ref(null);
	const sizeWidthModal = ref('')

    const storeRequests = useRequestsStore()
    const storeSettings = useSettingsStore();
    const router = useRouter();

    const disableScroll = () => {
        lockPadding();
        document.body.classList.add('noscroll');
    }

    const enableScroll = () => {
        document.body.classList.remove('noscroll');
        unlockPadding();
    }

    const lockPadding = () => {
        const paddingOffset = `${window.innerWidth - document.body.offsetWidth}px`;
        document.body.style.paddingRight = paddingOffset;
    }

    const unlockPadding = () => {
        document.body.style.paddingRight = '0px';
    }

    const closeRegistration = () => {
        if(modalId.value === 'registration' && modalId.value !== 'registrationEnd' && !storeRequests.isRegistrationSuccess) {
            sendMetrik('reachGoal', 'SignUp_Cancel');
        }
        storeRequests.isRegistrationSuccess = false
    }
    

    const closeModal = () =>{
        activeModal.value = false;
        closeRegistration();
        modalId.value = null;
        enableScroll();
        storeRequests.responseError = '';
    }

    const openModal = (id, options = {}) => {
		const { content = null, size = ''} = options; /* { content: user, size: '600' } { content: user } { size: '500' }. В модалке modalContent.key */
		closeModal();
		disableScroll();
		activeModal.value = true;
		modalId.value = id;
		if ('content' in options) {
			modalContent.value = options.content;
		}
		sizeWidthModal.value = size;
	};
    
    const triggerQrScan = () => {
        const qrElement = document.getElementById('apm-scan-qr');
        sendMetrik('reachGoal', 'Check_Click')
      
        setTimeout(() => {
            const closeApmBtn = document.getElementById('apm-close-widget-button');
            closeApmBtn?.addEventListener('click', () => {
                // sendMetrik('reachGoal', 'upload_close');
            })
        }, 1000)
        if (storeSettings.statusStockFuture) {
            openModal('promoNotStart');
        }
        if (storeSettings.statusStockPast) {
            openModal('promoEnd');
        }
        if (qrElement && storeRequests.isAuthenticated && storeSettings.statusStockActive) {
            qrElement.click();
            // if(storeRequests.userData?.receipt_status === 'upload_available') {
            //     qrElement.click();
            // } else {
            //     openModal('downloadReceiptsEnd');
            // }
        } 
        if (!storeRequests.isAuthenticated && storeSettings.statusStockActive) {
            openModal('authorizationRequired')
        }  
    }

    return modalsInstance = { activeModal, modalId, modalContent, sizeWidthModal, closeModal, openModal, triggerQrScan};
   
}