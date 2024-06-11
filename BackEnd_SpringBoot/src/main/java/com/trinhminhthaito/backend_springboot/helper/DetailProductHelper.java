package com.trinhminhthaito.backend_springboot.helper;

import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.ProductDetailRequest;

import com.trinhminhthaito.backend_springboot.models.productModels.Product;
import com.trinhminhthaito.backend_springboot.models.productModels.cameraModels.*;
import com.trinhminhthaito.backend_springboot.models.productModels.computerModels.*;
import com.trinhminhthaito.backend_springboot.models.productModels.mobileModels.*;
import com.trinhminhthaito.backend_springboot.models.productModels.peripheralsModels.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DetailProductHelper {
	private void addDetailCamera(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		Camera n = new Camera();
		var d = productDetailRequest.getInfoCamera();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setAperture(d.getAperture());
		n.setFocalLength(d.getFocalLength());
		n.setSensor(d.getSensor());
		n.setNumberOfPixel(d.getNumberOfPixel());
		n.setResolution(d.getResolution());
		product.setCamera(n);
	}

	// fn: add detail webcam
	private void addDetailWebcam(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoWebcam();
		Webcam n = new Webcam();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setConnectionStd(d.getConnectionStd());
		n.setResolution(d.getResolution());
		n.setFrameSpeed(d.getFrameSpeed());
		product.setWebcam(n);
	}

	// fn: add detail Disk
	private void addDetailDisk(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoDisk();
		Disk n = new Disk();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setCapacity(d.getCapacity());
		n.setSize(d.getSize());
		n.setType(d.getType());
		n.setConnectionStd(d.getConnectionStd());
		n.setReadSpeed(d.getReadSpeed());
		n.setWriteSpeed(d.getWriteSpeed());
		n.setRpm(d.getRpm());
		product.setDisk(n);
	}

	// fn: add Display
	private void addDetailDisplay(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoDisplay();
		Display n = new Display();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setCapacity(d.getCapacity());
		n.setManufacturer(d.getManufacturer());
		product.setDisplay(n);
	}

	// fn: add Laptop
	private void addDetailLaptop(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoLaptop();
		Laptop n = new Laptop();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setChipBrand(d.getChipBrand());
		n.setProcessorCount(d.getProcessorCount());
		n.setSeries(d.getSeries());
		n.setDetail(d.getDetail());
		n.setDisplay(d.getDisplay());
		n.setDisplaySize(d.getDisplaySize());
		n.setOperating(d.getOperating());
		n.setDisk(d.getDisk());
		n.setRam(d.getRam());
		n.setPin(d.getPin());
		n.setWeight(d.getWeight());
		product.setLaptop(n);
	}

	// fn: add Mainboard
	private void addDetailMainboard(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoMainboard();
		Mainboard n = new Mainboard();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setChipset(d.getChipset());
		n.setSeries(d.getSeries());
		n.setSocketType(d.getSocketType());
		n.setSizeStd(d.getSizeStd());
		product.setMainboard(n);
	}

	// fn: add ram
	private void addDetailRam(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoRam();
		Ram n = new Ram();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setCapacity(d.getCapacity());
		n.setBus(d.getBus());
		n.setType(d.getType());
		product.setRam(n);
	}

	// fn: add backup charger
	private void addDetailBackupCharger(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoBackupCharger();
		BackupCharger n = new BackupCharger();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setCapacity(d.getCapacity());
		n.setWeight(d.getWeight());
		n.setNumberOfPort(d.getNumberOfPort());
		n.setColor(d.getColor());
		n.setVoltage(d.getVoltage());
		product.setBackupCharger(n);
	}

	// fn: add mobile
	private void addDetailMobile(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoMobile();
		Mobile n = new Mobile();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setCpu(d.getCpu());
		n.setBefore(d.getBefore());
		n.setAfter(d.getAfter());
		n.setColor(d.getColor());
		n.setDisplaySize(d.getDisplaySize());
		n.setOperating(d.getOperating());
		n.setRom(d.getRom());
		n.setRam(d.getRam());
		n.setPin(d.getPin());
		product.setMobile(n);
	}

	// fn: add headphone
	private void addDetailHeadphone(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoHeadPhone();
		HeadPhone n = new HeadPhone();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setType(d.getType());
		n.setConnectionStd(d.getConnectionStd());
		product.setHeadPhone(n);
	}

	// fn: add keyboard
	private void addDetailKeyboard(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoKeyBoard();
		KeyBoard n = new KeyBoard();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setColor(d.getColor());
		n.setLedColor(d.getLedColor());
		product.setKeyBoard(n);
	}

	// fn: add monitor
	private void addDetailMonitor(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoMonitor();
		Monitor n = new Monitor();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setBgPlate(d.getBgPlate());
		n.setResolution(d.getResolution());
		n.setDisplaySize(d.getDisplaySize());
		n.setFrequency(d.getFrequency());
		n.setPort(d.getPort());
		product.setMonitor(n);
	}

	// fn: add mouse
	private void addDetailMouse(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoMouse();
		Mouse n = new Mouse();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setType(d.getType());
		n.setIsLed(d.getIsLed());
		product.setMouse(n);
	}

	// fn: add router
	private void addDetailRouter(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoRouter();
		Router n = new Router();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setBandwidth(d.getBandwidth());
		n.setStrong(d.getStrong());
		n.setNumberOfPort(d.getNumberOfPort());
		product.setRouter(n);
	}

	// fn: add speaker
	private void addDetailSpeaker(ProductDetailRequest productDetailRequest, List<String> catalog, Product product) {
		var d = productDetailRequest.getInfoSpeaker();
		Speaker n = new Speaker();
		n.setWarranty(d.getWarranty());
		n.setCatalogs(catalog);
		n.setWattage(d.getWattage());
		n.setConnectionPort(d.getConnectionPort());
		product.setSpeaker(n);
	}

	// fn: thêm thông tin detail
	// input:
	// - product sau đã thêm
	// - detail từ request,
	// - type product
	// - các ảnh catalog
	// - idProduct
	public void addDetail(ProductDetailRequest detail, int type, List<String> catalog, Product product) {
		switch (type) {
			case 1: addDetailCamera(detail, catalog, product); break; // camera
			case 2: addDetailWebcam(detail, catalog, product); break; // webcam
			case 3: addDetailDisk(detail, catalog, product); break; // disk
			case 4: addDetailDisplay(detail, catalog, product); break; // display
			case 5: addDetailLaptop(detail, catalog, product); break; // laptop
			case 6: addDetailMainboard(detail, catalog, product); break; // mainboard
			case 7: addDetailRam(detail, catalog, product); break; // ram
 			case 8: addDetailBackupCharger(detail, catalog, product); break; // backupcharger
			case 9: addDetailMobile(detail, catalog, product); break; // mobile
			case 10: addDetailHeadphone(detail, catalog, product); break; // headphone
			case 11: addDetailKeyboard(detail, catalog, product); break; // keyboard
			case 12: addDetailMonitor(detail, catalog, product); break; // monitor
			case 13: addDetailMouse(detail, catalog, product); break; // mouse
			case 14: addDetailRouter(detail, catalog, product); break; // router
			case 15: addDetailSpeaker(detail, catalog, product);break; // speaker
			default: break;
		}
	}

	// fn: find detail Product
	// input: type, Product
	// output: Object detail
	public Object findDetailByType(int type, Product product) {
		switch (type) {
			case 1: return product.getCamera();
			case 2: return product.getWebcam();
			case 3: return product.getDisk();
			case 4: return product.getDisplay();
			case 5: return product.getLaptop();
			case 6: return product.getMainboard();
			case 7: return product.getRam();
			case 8: return product.getBackupCharger();
			case 9: return product.getMobile();
			case 10: return product.getHeadPhone();
			case 11: return product.getKeyBoard();
			case 12: return product.getMonitor();
			case 13: return product.getMouse();
			case 14: return product.getRouter();
			case 15: return product.getSpeaker();
			default: return null;
		}
	}
}
