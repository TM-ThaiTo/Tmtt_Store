package com.trinhminhthaito.backend_springboot.helper;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

public class RegexConverter {
    public static Map<String, Object> convertObjectContainsRegex(Map<String, Object> obj) {
        Map<String, Object> newObj = new HashMap<>(obj);

        if (newObj.containsKey("$or")) {
            // đa giá trị
            List<Map<String, Object>> orList = (List<Map<String, Object>>) newObj.get("$or");
            for (Map<String, Object> item : orList) {
                for (String key : item.keySet()) {
                    if (item.get(key) instanceof Map) {
                        Map<String, Object> innerMap = (Map<String, Object>) item.get(key);
                        for (String k : innerMap.keySet()) {
                            if (k.equals("$regex") && innerMap.get(k) instanceof String) {
                                innerMap.put(k, Pattern.compile((String) innerMap.get(k), Pattern.CASE_INSENSITIVE));
                            }
                        }
                    }
                    if (key.equals("$regex") && item.get(key) instanceof String) {
                        item.put(key, Pattern.compile((String) item.get(key), Pattern.CASE_INSENSITIVE));
                    }
                }
            }
        } else {
            // đơn giá trị
            for (String key : newObj.keySet()) {
                if (newObj.get(key) instanceof Map) {
                    Map<String, Object> innerMap = (Map<String, Object>) newObj.get(key);
                    for (String k : innerMap.keySet()) {
                        if (k.equals("$regex") && innerMap.get(k) instanceof String) {
                            innerMap.put(k, Pattern.compile((String) innerMap.get(k), Pattern.CASE_INSENSITIVE));
                        }
                    }
                }
                if (key.equals("$regex") && newObj.get(key) instanceof String) {
                    newObj.put(key, Pattern.compile((String) newObj.get(key), Pattern.CASE_INSENSITIVE));
                }
            }
        }

        return newObj;
    }
}
