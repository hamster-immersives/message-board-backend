const getErrorMessage = (err) => {

    let message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = getDatabaseErrorMessage(err);
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (let errName in err.errors) {
            if (err.errors[errName].message) {
                message = err.errors[errName].message;
            }
        }
    }
    return message;
}

const getDatabaseErrorMessage = (err) => {
    let resultMessage; 
    try {
        let objectName = err.message.substring(0, err.message.indexOf('_1'));
        let whereToSlice = objectName.lastIndexOf(':') + 2; 
        resultMessage = objectName.slice(whereToSlice) + ' already exists';
    } catch (err) {
        resultMessage = 'unique field already exists';
    }
    return resultMessage;
}

module.exports = getErrorMessage;