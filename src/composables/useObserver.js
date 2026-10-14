export const sectionsObserver = () => {

    const callback = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // console.log(" entries.forEach entry.target:", entry.target)
            } else {
                observer.unobserve(entry.target)
                entry.target.classList.remove('animated');
            }
        })
    }
    
    const options = {
        rootMargin: '0px 0px -150px 0px',
        threshold: 0,
    }
    
    const observer = new IntersectionObserver(callback, options);

    return { observer }
}