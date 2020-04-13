package com.exasky.dnd.common;

import com.exasky.dnd.user.model.DnDUser;
import org.springframework.security.core.context.SecurityContextHolder;

public class Utils {
    public static DnDUser getCurrentUser() {
        return (DnDUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }
}
