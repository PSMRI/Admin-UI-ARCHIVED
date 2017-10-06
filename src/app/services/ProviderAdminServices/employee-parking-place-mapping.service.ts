import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { ConfigService } from "../config/config.service";

@Injectable()
export class EmployeeParkingPlaceMappingService {
     headers = new Headers( { 'Content-Type': 'application/json' } );
     options = new RequestOptions( { headers: this.headers } );

     providerAdmin_Base_Url: any;
     common_Base_Url:any;

     saveEmployeeParkingPlaceMappingURL:any;
     getEmployeeURL:any;
     _getStateListBYServiceIDURL:any;
     _getServiceLineURL:any;
     _getDistrictListURL:any;
     getParkingPlacesURL:any;
     getDesignationsURL:any;
     getEmployeesURL:any;

     constructor(private http: Http,public basepaths:ConfigService) { 
        this.providerAdmin_Base_Url = this.basepaths.getAdminBaseUrl();
        this.common_Base_Url = this.basepaths.getCommonBaseURL();

        //this.getEmployeeURL = this.providerAdmin_Base_Url + "m/SearchEmployeeFilter";
        this.saveEmployeeParkingPlaceMappingURL = this.providerAdmin_Base_Url + "parkingPlaceMaster/save/userParkingPlaces";
        this._getStateListBYServiceIDURL = this.providerAdmin_Base_Url + "m/location/getStatesByServiceID";
        this._getServiceLineURL = this.providerAdmin_Base_Url + "m/role/service";
        this._getDistrictListURL = this.common_Base_Url + "location/districts/";
        this.getParkingPlacesURL = this.providerAdmin_Base_Url + "parkingPlaceMaster/get/parkingPlaces";
        this.getDesignationsURL = this.providerAdmin_Base_Url + "m/getDesignation";
        this.getEmployeesURL = this.providerAdmin_Base_Url + "parkingPlaceMaster/get/userParkingPlaces";
     }
    
    getDesignations(){
    	return this.http.post(this.getDesignationsURL, {})
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getEmployees(requestObject) {
        return this.http.post(this.getEmployeesURL, requestObject)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    saveEmployeeParkingPlaceMappings(data){
        return this.http.post(this.saveEmployeeParkingPlaceMappingURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    getStatesByServiceID(serviceID,serviceProviderID) {
		return this.http.post(this._getStateListBYServiceIDURL, { "serviceID": serviceID,"serviceProviderID": serviceProviderID })
			.map(this.handleSuccess)
			.catch(this.handleError);
	}

    getServices(serviceProviderID,stateID) {
		return this.http.post(this._getServiceLineURL, { "serviceProviderID": serviceProviderID,
													  "stateID": stateID
													}).map(this.handleSuccess)
													.catch(this.handleError);
	}

    getDistricts ( stateId: number )
    {
        return this.http.get( this._getDistrictListURL + stateId, this.options )
            .map( this.handleSuccess )
            .catch( this.handleError );

    }

    getParkingPlaces(data){
        return this.http.post(this.getParkingPlacesURL, data)
        .map(this.handleSuccess)
        .catch(this.handleError);
    }

    handleSuccess(response: Response) {
        console.log(response.json().data, "--- in zone master SERVICE");
        return response.json().data;
    }

    handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}