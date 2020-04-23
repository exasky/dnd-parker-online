package com.exasky.dnd.adventure.rest.dto.layer;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;

public class LayerItemDeserializer extends StdDeserializer<LayerItemDto> {
    public LayerItemDeserializer() {
        this(null);
    }

    public LayerItemDeserializer(final Class<?> vc) {
        super(vc);
    }

    @Override
    public LayerItemDto deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        JsonNode node = jp.getCodec().readTree(jp);
        final ObjectMapper mapper = (ObjectMapper)jp.getCodec();
        switch (node.get("element").get("type").asText()) {
            case "TRAP":
//                mapper.readValue(node)
                return mapper.treeToValue(node, TrapLayerItemDto.class);
            default:
                return mapper.treeToValue(node, SimpleLayerItemDto.class);
        }
    }
}
