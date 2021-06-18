package com.aim.questionnaire.controller;


import com.aim.questionnaire.beans.HttpResponseEntity;
import com.aim.questionnaire.common.Constans;
import com.aim.questionnaire.common.utils.ExcelUtil;
import com.aim.questionnaire.dao.entity.UserEntity;
import com.aim.questionnaire.interceptor.Pager;
import com.aim.questionnaire.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.io.FileOutputStream;
import java.io.OutputStream;
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/admin")
public class UserController {
    @Autowired
    private UserService userService;
    private List<Object> userEntityList;


    @RequestMapping(value = "/userLogin", method = RequestMethod.POST, headers = "Accept=application/json")
    public HttpResponseEntity userLogin(@RequestBody Map<String, Object> map) {
        HttpResponseEntity httpResponseEntity = new HttpResponseEntity();
        String username = map.get("username").toString();
        String password = map.get("password").toString();
        UserEntity hasUser = userService.selectAllByName(username);
        if (password.equals(hasUser.getPassword())) {
            httpResponseEntity.setData(hasUser);
            httpResponseEntity.setCode(Constans.SUCCESS_CODE);
            httpResponseEntity.setMessage("登陆成功");
        } else {
            httpResponseEntity.setData(hasUser);
            httpResponseEntity.setCode(Constans.EXIST_CODE);
            httpResponseEntity.setMessage("密码错误");
        }
        return httpResponseEntity;
    }

    @RequestMapping(value = "/faceRecLogin", method = RequestMethod.POST, headers = "Accept=application/json")
    public HttpResponseEntity faceRecLogin(@RequestBody Map<String, Object> map) {
        HttpResponseEntity httpResponseEntity = new HttpResponseEntity();
        String imgData = map.get("image").toString();
        UserEntity admin = userService.selectAllByName("admin");
        httpResponseEntity.setCode(Constans.SUCCESS_CODE);
        httpResponseEntity.setMessage("登陆成功");
        httpResponseEntity.setData(admin);
        return httpResponseEntity;
    }

    @RequestMapping(value = "/addUserInfo", method = RequestMethod.POST, headers = "Accept=application/json")
    public HttpResponseEntity addUserInfo(@RequestBody UserEntity userEntity) {
        HttpResponseEntity httpResponseEntity = new HttpResponseEntity();
        int result = userService.insertUserInfo(userEntity);
        httpResponseEntity.setData(result);
        httpResponseEntity.setCode(Constans.SUCCESS_CODE);
        httpResponseEntity.setMessage(Constans.ADD_MESSAGE);
        return httpResponseEntity;
    }

    @RequestMapping(value = "/queryUserList", method = RequestMethod.POST, headers = "Accept=application/json")
    public HttpResponseEntity queryUserList(@RequestBody Map<String, Object> map) {
        HttpResponseEntity httpResponseEntity = new HttpResponseEntity();

        String username = map.get("userName").toString();
        int pageNum = Integer.parseInt(map.get("pageNum").toString());
        int pageSize = Integer.parseInt(map.get("pageSize").toString());
//        userEntityList = userService.queryUserByName(username);
        Pager<Object> pagerUserEntity = userService.findByPager(username, pageNum, pageSize);
        userEntityList = pagerUserEntity.getRows();
//        System.out.println(pagerUserEntity.getTotal());
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("list", userEntityList);
        userMap.put("total", pagerUserEntity.getTotal());
        if (userEntityList.size() != 0) {
            httpResponseEntity.setData(userMap);
            httpResponseEntity.setCode(Constans.SUCCESS_CODE);
            httpResponseEntity.setMessage("查询成功");
        } else {
            httpResponseEntity.setData(userMap);
            httpResponseEntity.setCode(Constans.SUCCESS_CODE);
            httpResponseEntity.setMessage("无数据");
        }
        return httpResponseEntity;
    }

    @RequestMapping(value = "/addUserInfoList", method = RequestMethod.POST, headers = "Accept=application/json")
    public HttpResponseEntity addUserInfoList(@RequestBody Map<String, Object> userListMap) {
        HttpResponseEntity httpResponseEntity = new HttpResponseEntity();
        int result = 0;
        List<Object> userList = (List<Object>) userListMap.get("userList");
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd H:mm:ss");
        for (int i = 0; i < userList.size(); i++) {
            ObjectMapper objectMapper = new ObjectMapper();
            UserEntity ue = objectMapper.convertValue(userList.get(i), UserEntity.class);
            UserEntity userEntity = new UserEntity();
            if (ue.startTimeStr == null || ue.startTimeStr.equals(""))
                userEntity.setStartTime(ue.getStartTime());
            else {
                Date startTime = sdf.parse(ue.startTimeStr, new ParsePosition(0));
                userEntity.setStartTime(startTime);
            }
            if (ue.stopTimeStr == null || ue.stopTimeStr.equals("")) {
                userEntity.setStopTime(ue.getStopTime());
            } else {
                Date stopTime = sdf.parse(ue.stopTimeStr, new ParsePosition(0));
                userEntity.setStopTime(stopTime);
            }
            if (ue.userName == null || ue.userName.equals(""))
                userEntity.setUsername(ue.getUsername());
            else
                userEntity.setUsername(ue.userName);
            userEntity.setPassword(ue.getPassword());
            result = userService.insertUserInfo(userEntity);
        }
        httpResponseEntity.setData(result);
        httpResponseEntity.setCode(Constans.SUCCESS_CODE);
        httpResponseEntity.setMessage(Constans.ADD_MESSAGE);
        return httpResponseEntity;
    }

    @RequestMapping(value = "/selectUserListToExcel", method = RequestMethod.POST, headers = "Accept=application/json")
    public HttpResponseEntity selectUserListToExcel(@RequestBody String temp) {
        HttpResponseEntity httpResponseEntity = new HttpResponseEntity();
        // excel标题
        String[] title = {"id", "username", "password", "startTime", "stopTime", "status", "createdBy", "creationDate", "lastUpdateBy", "lastUpdateDate"};
        // excel文件名
        String fileName = "用户信息表" + System.currentTimeMillis() + ".xlsx";
        // sheet
        String sheetName = "用户信息表";
        String[][] content = new String[userEntityList.size()][];
        for (int i = 0; i < userEntityList.size(); i++) {
            content[i] = new String[title.length];
            UserEntity userEntity = (UserEntity) userEntityList.get(i);
            content[i][0] = userEntity.getId();
            content[i][1] = userEntity.getUsername();
            content[i][2] = userEntity.getPassword();
            content[i][3] = userEntity.getStartTime().toString();
            content[i][4] = userEntity.getStopTime().toString();
            content[i][5] = userEntity.getStatus();
            content[i][6] = userEntity.getCreatedBy();
            content[i][7] = userEntity.getCreationDate().toString();
            content[i][8] = userEntity.getLastUpdatedBy();
            content[i][9] = userEntity.getLastUpdateDate().toString();
        }

        HSSFWorkbook wb = ExcelUtil.getHSSFWorkbook(sheetName, title, content, null);

        try {
            OutputStream os = new FileOutputStream("D:\\" + fileName);
            wb.write(os);
            os.flush();
            os.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        httpResponseEntity.setData("D:\\" + fileName);
        httpResponseEntity.setCode(Constans.SUCCESS_CODE);
        httpResponseEntity.setMessage("保存成功");
        return httpResponseEntity;
    }
}

