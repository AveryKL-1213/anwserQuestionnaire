package com.aim.questionnaire.service;

import com.aim.questionnaire.dao.UserEntityMapper;
import com.aim.questionnaire.dao.entity.ProjectEntity;
import com.aim.questionnaire.dao.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {
    @Autowired
    private UserEntityMapper userEntityMapper;

    public UserEntity selectAllByName(String username) {
        UserEntity hasUser = userEntityMapper.selectAllByName(username);
        return hasUser;
    }

    public int insertUserInfo(UserEntity userEntity){
        String id = UUID.randomUUID().toString().replaceAll("-","");
        String user = "admin";
        userEntity.setId(id);
//        userEntity.setStatus(null);
        //获取用户信息
        userEntity.setCreatedBy(user);
        userEntity.setLastUpdatedBy(user);
        // 获取当前时间
        Date date = new Date(System.currentTimeMillis());
        userEntity.setCreationDate(date);
        userEntity.setLastUpdateDate(date);

        int result = userEntityMapper.insertSelective(userEntity);
        return result;
    }

}
