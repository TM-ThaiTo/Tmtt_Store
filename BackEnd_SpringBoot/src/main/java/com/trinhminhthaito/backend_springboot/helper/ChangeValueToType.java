package com.trinhminhthaito.backend_springboot.helper;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class ChangeValueToType {
    private final Map<String, Integer> productTypeMap = new HashMap<>();

    public ChangeValueToType() {
        // Initialize productTypeMap in the constructor
        String[][] productTypes = {
                // === Camera ===//
                { "camera", "1" },
                { "máy ảnh", "1" },
                { "chụp hình", "1" },

                // === Webcam ===//
                { "webcam", "2" },

                // === Disk ===//
                { "disk", "3" },
                { "Ổ cứng", "3" },
                { "bộ nhớ trong", "3" },
                { "ssd", "3" },
                { "hhd", "3" },

                // === Display ===//
                { "display", "4" },
                { "Display", "4" },
                { "Card màn hình", "4" },
                { "Card đồ hoạ", "4" },
                { "GPU (Graphics Processing Unit)", "4" },
                { "Graphics Card", "4" },
                { "Card màn hình ngoài", "4" },
                { "Card đồ họa rời", "4" },
                { "Card đồ họa tích hợp", "4" },

                // === Laptop ===//
                { "laptop", "5" },
                { "Laptop", "5" },
                { "máy tính xách tay", "5" },

                // === Mainboard ===//
                { "mainboard", "6" },

                // === Ram ===//
                { "ram", "7" },
                { "RAM", "7" },
                { "Memory", "7" },
                { "Random Access Memory", "7" },
                { "DDR (Double Data Rate)", "7" },
                { "DIMM (Dual In-line Memory Module)", "7" },
                { "System Memory", "7" },
                { "Memory Upgrade", "7" },
                { "Computer Memory", "7" },

                // === Backupcharger ===//
                { "backupcharger", "8" },

                // === Mobile ===//
                { "mobile", "9" },

                // === Headphone ===//
                { "headphone", "10" },

                // === Keyboard ===//
                { "keyboard", "11" },

                // === Monitor ===//
                { "monitor", "12" },
                { "màn hình", "12" },
                { "màn hình di động", "12" },
                { "OLED", "12" },
                { "Màn hình chơi game", "12" },

                // === Mouse ===//
                { "mouse", "13" },

                // === Router ===//
                { "router", "14" },

                // === Speaker ===//
                { "speaker", "15" },
        };

        // Populate the productTypeMap
        for (String[] productType : productTypes) {
            productTypeMap.put(productType[0], Integer.parseInt(productType[1]));
        }
    }

    public Number productTypeMap(String value) {
        // Method to retrieve product type from the map
        return productTypeMap.getOrDefault(value, -1);
    }
}
