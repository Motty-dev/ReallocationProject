import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const showToast = (title, message, variant) => {
    return new ShowToastEvent({
        title: title,
        message: message,
        variant: variant,
    });
};

export { showToast };
