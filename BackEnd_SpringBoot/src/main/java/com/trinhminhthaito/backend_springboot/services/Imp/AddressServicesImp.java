package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.dtos.address.DataAddress;
import com.trinhminhthaito.backend_springboot.dtos.request.DeliveryAddressRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.accountModels.Address;
import com.trinhminhthaito.backend_springboot.models.accountModels.User;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.UserRepository;
import com.trinhminhthaito.backend_springboot.services.AddressServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.OptionalInt;
import java.util.stream.Collectors;

@Service
public class AddressServicesImp implements AddressServices {
	private final ResourceLoader resourceLoader;
	private final ObjectMapper objectMapper;

	private final UserRepository userRepository;
	@Autowired
	public AddressServicesImp(@Qualifier("webApplicationContext") ResourceLoader resourceLoader,
							  ObjectMapper objectMapper,
							  UserRepository userRepository) {
		this.resourceLoader = resourceLoader;
		this.objectMapper = objectMapper;
		this.userRepository = userRepository;
	}

	// get: all
	@Override
	public DataAddress getDataJsonAddress() throws IOException {
		Resource resource = resourceLoader.getResource("classpath:AddressVietNam.json");
		return objectMapper.readValue(resource.getInputStream(), DataAddress.class);
	}

	// get: huyện theo id tỉnh
	@Override
	public List<DataAddress.District> getDistrictsByProvinceId(String provinceId) throws IOException {
		DataAddress dataAddress = getDataJsonAddress();
		return dataAddress.getDistrict().stream()
				.filter(district -> district.getIdProvince().equals(provinceId))
				.collect(Collectors.toList());
	}

	// get: phường theo id huyện
	@Override
	public List<DataAddress.Commune> getCommunesByDistrictId(String districtId) throws IOException {
		DataAddress dataAddress = getDataJsonAddress();
		return dataAddress.getCommune().stream()
				.filter(commune -> commune.getIdDistrict().equals(districtId))
				.collect(Collectors.toList());
	}

	// get: List delivery address của user
	@Override
	public List<Address> getDeliveryAddressByAccountId(String id){
		User user = userRepository.findByAccountId(id);
		return user.getDeliveryAddress();
	}

	// fn: Kiểm tra tồn tại địa chỉ nhận hàng
	private boolean isAddressDuplicate(Address existingAddress, DeliveryAddressRequest addressRequest) {
		return Objects.equals(existingAddress.getName(), addressRequest.getName()) &&
				Objects.equals(existingAddress.getPhone(), addressRequest.getPhone()) &&
				Objects.equals(existingAddress.getProvince(), addressRequest.getProvince()) &&
				Objects.equals(existingAddress.getDistrict(), addressRequest.getDistrict()) &&
				Objects.equals(existingAddress.getWards(), addressRequest.getWards()) &&
				Objects.equals(existingAddress.getStreet(), addressRequest.getStreet());
	}

	// fn: hàm tăng id
	private int generateNewID(List<Address> addressList) {
		OptionalInt maxId = addressList.stream()
				.mapToInt(Address::getId)
				.max();
		return maxId.orElse(0) + 1;
	}

	// post: add delivery address
	@Override
	public MessageResponse addAddress(DeliveryAddressRequest addressRequest){
		MessageResponse messageResponse = new MessageResponse();
		User user = userRepository.findByAccountId(addressRequest.getAccountId());
		if(user == null){
			messageResponse.setCode(1);
			messageResponse.setMessage("User not found");
			return messageResponse;
		}
		List<Address> addressList = user.getDeliveryAddress();
		for (Address existingAddress : addressList) {
			if (isAddressDuplicate(existingAddress, addressRequest)) {
				messageResponse.setCode(2);
				messageResponse.setMessage("Address already exists");
				return messageResponse;
			}
		}
		int newId = generateNewID(addressList);
		// Add the new address to the list
		Address newAddress = new Address(
				newId,
				addressRequest.getName(),
				addressRequest.getPhone(),
				addressRequest.getProvince(),
				addressRequest.getDistrict(),
				addressRequest.getWards(),
				addressRequest.getStreet(),
				addressRequest.getDetails(),
				addressRequest.getNote()
		);
		addressList.add(newAddress);
		// Save the user
		user.setDeliveryAddress(addressList);
		userRepository.save(user);
		// return
		messageResponse.setCode(0);
		messageResponse.setMessage("Address added successfully");
		return messageResponse;
	}

	// delete: delete delivery address
	@Override
	public MessageResponse deleteDeliveryAddress(String idAccount, int idAddress) {
		MessageResponse messageResponse = new MessageResponse();
		User user = userRepository.findByAccountId(idAccount);
		if (user == null) {
			messageResponse.setCode(1);
			messageResponse.setMessage("User not found");
			return messageResponse;
		}
		List<Address> addressList = user.getDeliveryAddress();

		// Find the address with the given ID
		Optional<Address> addressToRemove = addressList.stream()
				.filter(address -> address.getId() == idAddress)
				.findFirst();

		if (addressToRemove.isPresent()) {
			addressList.remove(addressToRemove.get());
			// Save the updated user
			user.setDeliveryAddress(addressList);
			userRepository.save(user);

			messageResponse.setCode(0);
			messageResponse.setMessage("Address deleted successfully");
		} else {
			messageResponse.setCode(2);
			messageResponse.setMessage("Address not found");
		}

		return messageResponse;
	}

	// put: update default delivery address
	@Override
	public MessageResponse updateDefaultAddress(String idAccount, int idAddress) {
		MessageResponse messageResponse = new MessageResponse();
		User user = userRepository.findByAccountId(idAccount);
		if (user == null) {
			messageResponse.setCode(1);
			messageResponse.setMessage("User not found");
			return messageResponse;
		}

		List<Address> addressList = user.getDeliveryAddress();

		// Find the address with the given ID
		Optional<Address> addressToUpdateOpt = addressList.stream()
				.filter(address -> address.getId() == idAddress)
				.findFirst();

		if (addressToUpdateOpt.isPresent()) {
			Address addressToUpdate = addressToUpdateOpt.get();
			// Set the ID of the selected address to 1 (default ID)
			addressToUpdate.setId(1);
			// Increment the IDs of other addresses
			int newId = 2;
			for (Address address : addressList) {
				if (address != addressToUpdate) {
					address.setId(newId++);
				}
			}
			// Save the updated user
			user.setDeliveryAddress(addressList);
			userRepository.save(user);

			messageResponse.setCode(0);
			messageResponse.setMessage("Default address updated successfully");
		} else {
			messageResponse.setCode(2);
			messageResponse.setMessage("Address not found");
		}
		return messageResponse;
	}
}
