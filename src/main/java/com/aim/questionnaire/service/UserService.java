package com.aim.questionnaire.service;

import com.aim.questionnaire.dao.UserEntityMapper;
import com.aim.questionnaire.dao.entity.UserEntity;
import com.aim.questionnaire.interceptor.Pager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserService {
    @Autowired
    private UserEntityMapper userEntityMapper;

    public UserEntity selectAllByName(String username) {
        return userEntityMapper.selectAllByName(username);
    }

    public int insertUserInfo(UserEntity userEntity) {
        String id = UUID.randomUUID().toString().replaceAll("-", "");
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

        return userEntityMapper.insertSelective(userEntity);
    }

    public List<Object> queryUserByName(String username) {
        return userEntityMapper.queryUserByName(username);
    }

    public Pager<Object> findByPager(String username, int page, int size) {
        Map<String, Object> params = new HashMap<String, Object>();
        params.put("page", page);
        params.put("size", size);
        params.put("username", username);
        Pager<Object> pager = new Pager<Object>();
        List<Object> list = userEntityMapper.findByPager(params);
        pager.setRows(list);
        pager.setTotal(userEntityMapper.count(username));
        return pager;
    }
}
