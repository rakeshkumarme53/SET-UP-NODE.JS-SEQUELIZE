const ApiError = require('../middlewares/apiError');
const UserType = require('../enums/UserType');

class DoctorValidation {
  
    static updateDetails(userPerformer, doctor) {
        if (!userPerformer)
            throw ApiError.badRequest('Performed by is required');

        if (!doctor.headline)
            throw ApiError.badRequest('headline is required');
        if (!doctor.bio)
            throw ApiError.badRequest('brief detail is required');
        if (!doctor.consultation_fees)
            throw ApiError.badRequest('Consultation fees is required');
        if (!doctor.followup_fees)
            throw ApiError.badRequest('followup_feesis required');
            
        if (!doctor.degree)
        throw ApiError.badRequest('degree is required');
        if (!doctor.experience)
        throw ApiError.badRequest('brief detail is required');

        return true;
    }

    static updateAddress(userPerformer, doctor) {
        if (!userPerformer)
            throw ApiError.badRequest('Performed by is required');

        if (!doctor.id)
            throw ApiError.badRequest('User id is required');
        if (!doctor.street_name)
            throw ApiError.badRequest('Street name is required');
        if (!doctor.city)
            throw ApiError.badRequest('City is required');
        if (!doctor.district)
            throw ApiError.badRequest('District is required');
        if (!doctor.country)
            throw ApiError.badRequest('Country is required');
        if (!doctor.pincode)
            throw ApiError.badRequest('Pincode is required');

        return isValid;
    }


    static updateStatus(userPerformer, id, status) {
        if (!userPerformer)
            throw ApiError.badRequest('Performed by is required');

        if (!id)
            throw ApiError.badRequest('User id is required');

        if (status === undefined)
            throw ApiError.badRequest('Status is required');

        // if (userPerformer.user_type !== UserType.Admin) {
        //     throw ApiError.notAuthorized();
        // }

        return true;
    }

    static delete(userPerformer, id) {
        if (!userPerformer)
            throw ApiError.badRequest('Performed by user is required');
        if (!id)
            throw ApiError.badRequest('User id is required');

        // if (userPerformer.user_type !== UserType.Admin)
        //     throw ApiError.notAuthorized();

        return true;
    }
}

module.exports = DoctorValidation;