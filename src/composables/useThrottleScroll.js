export const useThrottleScroll = () => {    
    let isThrottled = false;
    const throttleScroll = (func, ms = 200) => {        
        if (isThrottled) return;
        isThrottled = true;
        setTimeout(() => {
            func();           
            isThrottled = false;
        }, ms); 
    };

    return {
        throttleScroll,        
    }
}