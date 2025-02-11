/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package cn.sliew.scaleph.engine.flink.kubernetes.operator.util;

import cn.sliew.milky.common.util.JacksonUtil;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public enum JsonPatchMerger {
    ;

    public static <T> T merge(T target, T patch, Class<T> resourceClass) {
        JsonNode targetNode = JacksonUtil.toJsonNode(target);
        JsonNode patchNode = JacksonUtil.toJsonNode(patch);
        JsonNode patched = mergePatch(targetNode, patchNode);
        return JacksonUtil.toObject(patched, resourceClass);
    }

    public static JsonNode mergePatch(final JsonNode target, final JsonNode patch) {
        if (!(patch instanceof ObjectNode)) {
            return patch;
        } else {
            ObjectNode patchObject = (ObjectNode) patch;
            ObjectNode targetObject;
            if (target instanceof ObjectNode) {
                targetObject = (ObjectNode) target;
            } else {
                targetObject = newEmptyObjectNodeUsingSameFactoryAs(patchObject);
            }

            patch.fields().forEachRemaining(field -> {
                String key = field.getKey();
                JsonNode value = field.getValue();
                if (value.isNull()) {
                    targetObject.remove(key);
                } else {
                    JsonNode existingValue = targetObject.get(key);
                    JsonNode mergeResult = mergePatch(existingValue, value);
                    targetObject.replace(key, mergeResult);
                }
            });
            return targetObject;
        }
    }

    private static ObjectNode newEmptyObjectNodeUsingSameFactoryAs(ObjectNode node) {
        return node.objectNode();
    }

}
