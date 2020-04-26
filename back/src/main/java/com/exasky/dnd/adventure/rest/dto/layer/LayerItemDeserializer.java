package com.exasky.dnd.adventure.rest.dto.layer;

import com.exasky.dnd.adventure.model.layer.LayerElementType;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

@SuppressWarnings("rawtypes")
public class LayerItemDeserializer extends StdDeserializer<LayerItemDto> {
    public LayerItemDeserializer() {
        this(null);
    }

    public LayerItemDeserializer(final Class<?> vc) {
        super(vc);
    }

    @Override
    public LayerItemDto deserialize(JsonParser jp, DeserializationContext ctx) throws IOException {
        JsonNode node = jp.getCodec().readTree(jp);
        final ObjectMapper mapper = (ObjectMapper)jp.getCodec();

        LayerElementType type = LayerElementType.valueOf(node.get("element").get("type").asText());
        switch (type) {
            case TRAP:
                return mapper.treeToValue(node, TrapLayerItemDto.class);
            case DOOR:
                return mapper.treeToValue(node, DoorLayerItemDto.class);
            case CHEST:
                return mapper.treeToValue(node, ChestLayerItemDto.class);
            case MONSTER:
                return mapper.treeToValue(node, MonsterLayerItemDto.class);
            case CHARACTER:
                return mapper.treeToValue(node, CharacterLayerItemDto.class);
            default:
                return mapper.treeToValue(node, SimpleLayerItemDto.class);
        }
    }
}
