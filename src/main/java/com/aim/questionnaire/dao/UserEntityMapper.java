package com.aim.questionnaire.dao;

import com.aim.questionnaire.dao.entity.UserEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


@Repository
public interface UserEntityMapper {
    /**
     * 根据用户名查找用户信息
     *
     * @param username
     * @return
     */
    UserEntity selectAllByName(String username);

    int insertSelective(UserEntity userEntity);

    List<Object> queryUserByName(String username);

    List<Object> findByPager(Map<String, Object> params);

    long count(String username);

}