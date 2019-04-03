class Validator {
	constructor() {

	}

	static checkEmail(str) {
		let email = str.match(/^[\w\.\+'-]+@[\w\.\+'-]+$/i);
		return (email == str);
	}

	static checkPhone(str) {
		let phone = str.match(/^[\+\d][\d\s-]+$/);
		return (phone == str);
	}

	static checkDate(str) {
		let date = str.match(/^\d{0,2}\.\d{0,2}\.\d{0,4}/);
		let now = new Date();
		let arr = [];
		if (date) {
			arr = str.split('.');
			return ( (arr[0] > 0 && arr[0] <= 31) && (arr[1] > 0 && arr[1] <= 12) && (arr[2] <= now.getFullYear()) && arr[2] > 1900);
		} else {
			return false;
		}
	}

	static checkDomain(str) {
		let domain = str.match(/^(?:http(?:s)?:\/\/)?[\wА-Яа-яЁё\.\+'-]+$/i);
		return (domain == str);
	}
}
