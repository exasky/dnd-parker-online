package com.exasky.dnd.adventure.rest.dto.switch_equipment;

public class SelectSwitchEquipmentDto {
    private Long equipmentId;
    private Boolean isEquipment;

    public Long getEquipmentId() {
        return equipmentId;
    }

    public void setEquipmentId(Long equipmentId) {
        this.equipmentId = equipmentId;
    }

    public Boolean getIsEquipment() {
        return isEquipment;
    }

    public void setIsEquipment(Boolean equipment) {
        isEquipment = equipment;
    }
}
