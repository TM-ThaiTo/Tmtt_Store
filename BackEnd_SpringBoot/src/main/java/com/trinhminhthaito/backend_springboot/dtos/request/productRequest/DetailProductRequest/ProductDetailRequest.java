package com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest;

import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.cameraRequest.*;
import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.computerRequest.*;
import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.mobileRequest.*;
import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.peripheralsRequest.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


/*
* 1: camera
* 2: webcam
* 3: disk
* 4: display
* 5: laptop
* 6: mainboard
* 7: ram
* 8: backupcharger
* 9: mobile
* 10: headphone
* 11: keyboard
* 12: monitor
* 13: mouse
* 14: router
* 15: speaker
*/
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDetailRequest {
	private List<String> catalogs;
	private int warranty;

	private InfoCamera infoCamera;
	private InfoWebcam infoWebcam;

	private InfoDisk infoDisk;
	private InfoRam infoRam;
	private InfoLaptop infoLaptop;
	private InfoDisplay infoDisplay;
	private InfoMainboard infoMainboard;

	private InfoBackupCharger infoBackupCharger;
	private InfoMobile infoMobile;

	private InfoHeadPhone infoHeadPhone;
	private InfoKeyBoard infoKeyBoard;
	private InfoMonitor infoMonitor;
	private InfoMouse infoMouse;
	private InfoRouter infoRouter;
	private InfoSpeaker infoSpeaker;
}