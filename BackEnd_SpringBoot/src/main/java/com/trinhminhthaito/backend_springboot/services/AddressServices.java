package com.trinhminhthaito.backend_springboot.services;

import com.trinhminhthaito.backend_springboot.dtos.address.DataAddress;
import com.trinhminhthaito.backend_springboot.dtos.request.DeliveryAddressRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.accountModels.Address;

import java.io.IOException;
import java.util.List;

public interface AddressServices {
	DataAddress getDataJsonAddress() throws IOException;
	List<DataAddress.District> getDistrictsByProvinceId(String provinceId) throws IOException;
	List<DataAddress.Commune> getCommunesByDistrictId(String districtId) throws IOException;

	List<Address> getDeliveryAddressByAccountId(String accountId);
	MessageResponse addAddress(DeliveryAddressRequest address);
	MessageResponse deleteDeliveryAddress(String idAccount, int idAddress);
	MessageResponse updateDefaultAddress(String idAccount, int address);
}
