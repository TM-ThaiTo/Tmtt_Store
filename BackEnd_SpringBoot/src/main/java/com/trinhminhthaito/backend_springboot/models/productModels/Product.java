package com.trinhminhthaito.backend_springboot.models.productModels;

import com.trinhminhthaito.backend_springboot.models.productModels.cameraModels.*;
import com.trinhminhthaito.backend_springboot.models.productModels.computerModels.*;
import com.trinhminhthaito.backend_springboot.models.productModels.mobileModels.*;
import com.trinhminhthaito.backend_springboot.models.productModels.peripheralsModels.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "product")
public class Product {
	@Id
	private String id;
	private String code;
	private String name;
	private Number price = 0;
	private int type;
	private String brand;
	private String avt;
	private int stock = 0;
	private int sold = 0;
	private Number discount = 0;
	private Number rates = 0;
	private List<OtherInfo> otherInfo = new ArrayList<>();
	private List<Comment> comment = new ArrayList<>();

	private Camera camera;
	private Webcam webcam;

	private Disk disk;
	private Ram ram;
	private Laptop laptop;
	private Display display;
	private Mainboard mainboard;

	private BackupCharger backupCharger;
	private Mobile mobile;

	private HeadPhone headPhone;
	private KeyBoard keyBoard;
	private Monitor monitor;
	private Mouse mouse;
	private Router router;
	private Speaker speaker;

	private DescProduct desc;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
class OtherInfo {
	private String key;
	private String value;
}
