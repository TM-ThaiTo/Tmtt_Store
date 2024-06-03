package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.repository.accountRepository.RoleRepository;
import com.trinhminhthaito.backend_springboot.services.RoleServices;
import org.springframework.stereotype.Service;

@Service
public class RoleServicesImp implements RoleServices {
	private final RoleRepository roleRepository;
	public RoleServicesImp(RoleRepository roleRepository) {
		this.roleRepository = roleRepository;
	}

	// fn: find name role by id
	public String findNamebyId(String id){
		return roleRepository.findById(id).get().getName();
	}
}
