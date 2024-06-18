package com.trinhminhthaito.backend_springboot.controller;

import com.trinhminhthaito.backend_springboot.dtos.address.DataAddress;
import com.trinhminhthaito.backend_springboot.dtos.request.DeliveryAddressRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.accountModels.Address;
import com.trinhminhthaito.backend_springboot.services.AddressServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/address")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AddressController {

	private final AddressServices addressServices;

	@Autowired
	public AddressController(AddressServices addressServices) {
		this.addressServices = addressServices;
	}

	// == api: lấy danh sách các tỉnh Việt Nam
	// ==> input: none
	// ===> output: list Province
	@GetMapping("/provinces")
//	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> getProvinces() throws IOException {
		List<DataAddress.Province> data = addressServices.getDataJsonAddress().getProvince();
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		messageDataResponse.setCode(0);
		messageDataResponse.setMessage("success");
		messageDataResponse.setData(data);
		return ResponseEntity.ok(messageDataResponse);
	}

	// api: lấy danh sách huyện theo tỉnh
	// ==> input: id của tỉnh
	// ===> output: list huyện
	@GetMapping("/districts")
//	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> getDistricts(@RequestParam String provinceId) throws IOException {
		List<DataAddress.District> data = addressServices.getDistrictsByProvinceId(provinceId);
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		messageDataResponse.setCode(0);
		messageDataResponse.setMessage("success");
		messageDataResponse.setData(data);
		return ResponseEntity.ok(messageDataResponse);
	}

	// api: lấy danh sách phường Commune theo huyện
	// ==> input: id của huyện
	// ===> output: list phường Commune
	@GetMapping("/communes")
//	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> getCommunesByDistrictId(@RequestParam String districtId) throws IOException {
		List<DataAddress.Commune> data = addressServices.getCommunesByDistrictId(districtId);
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		messageDataResponse.setCode(0);
		messageDataResponse.setMessage("success");
		messageDataResponse.setData(data);
		return ResponseEntity.ok(messageDataResponse);
	}


	// api: Get list delivery by id
	@GetMapping("/delivery")
	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> getDeliveryByIdAccount(@RequestParam String accountId) {
		List<DeliveryAddressRequest> deliveryAddressRequests = new ArrayList<>();
		List<Address> deliveryAddress = addressServices.getDeliveryAddressByAccountId(accountId);

		for (Address address : deliveryAddress) {
			DeliveryAddressRequest item = new DeliveryAddressRequest();
			item.setId(address.getId());
			item.setName(address.getName());
			item.setPhone(address.getPhone());
			item.setProvince(address.getProvince());
			item.setStreet(address.getStreet());
			item.setDistrict(address.getDistrict());
			item.setWards(address.getWards());
			item.setDetails(address.getDetails());
			item.setNote(address.getNote());
			String add = String.join(", ", address.getStreet(), address.getWards(), address.getDistrict(), address.getProvince());
			item.setAddress(add);
			deliveryAddressRequests.add(item);
		}

		MessageDataResponse messageDataResponse = new MessageDataResponse();
		if (deliveryAddress.isEmpty()) {
			messageDataResponse.setCode(1);
			messageDataResponse.setMessage("Address not found");
			return ResponseEntity.ok(messageDataResponse);
		}

		messageDataResponse.setCode(0);
		messageDataResponse.setMessage("Success");
		messageDataResponse.setData(deliveryAddressRequests);
		return ResponseEntity.ok(messageDataResponse);
	}

	// api: add delivery address
	@PostMapping("/delivery/add")
	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> addDelivery(@RequestBody DeliveryAddressRequest address){
		MessageResponse messageResponse = addressServices.addAddress(address);
		return ResponseEntity.ok(messageResponse);
	}

	// api: delete delivery address
	@DeleteMapping("/delivery")
	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> deleteDelivery(@RequestParam String idAccount, @RequestParam int idAddress){
		MessageResponse messageResponse = addressServices.deleteDeliveryAddress(idAccount, idAddress);
		return ResponseEntity.ok(messageResponse);
	}

	// api: update default delivery address
	@PutMapping("/delivery")
	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> updateDelivery(@RequestParam String idAccount, @RequestParam int idAddress){
		MessageResponse messageResponse = addressServices.updateDefaultAddress(idAccount, idAddress);
		return ResponseEntity.ok(messageResponse);
	}
}
