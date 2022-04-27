package cn.sliew.breeze.service.meta;

import cn.sliew.breeze.service.dto.meta.MetaDataMapDTO;
import cn.sliew.breeze.service.param.meta.MetaDataMapParam;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.io.Serializable;
import java.util.Map;

/**
 * <p>
 * 元数据-参考数据映射 服务类
 * </p>
 *
 * @author liyu
 * @since 2022-04-25
 */
public interface MetaDataMapService {
    int insert(MetaDataMapDTO MetaDataMapDTO);

    int update(MetaDataMapDTO MetaDataMapDTO);

    int deleteById(Long id);

    int deleteBatch(Map<Integer, ? extends Serializable> map);

    Page<MetaDataMapDTO> listByPage(MetaDataMapParam param);
}
