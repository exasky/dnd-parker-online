package com.exasky.dnd.common;

public final class Constant {
    public static final String REST_URL = "/rest/v1";

    /* **********************************
     *               ERRORS              *
     ** **********************************/
    public static final class Errors {
        public static final String AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR";
        public static final String JWT_EXPIRED = "JWT_EXPIRED";

        public static final class CAMPAIGN {
            private static final String PREFIX = "CAMPAIGN.";

            public static final String NOT_FOUND = PREFIX + "NOT_FOUND";
            public static final String NAME_EMPTY = PREFIX + "NAME_EMPTY";
        }

        public static final class ADVENTURE {
            private static final String PREFIX = "ADVENTURE.";

            public static final String NOT_FOUND = PREFIX + "NOT_FOUND";
            public static final String LAYER_ITEM_NOT_FOUND = PREFIX + "LAYER_ITEM_NOT_FOUND";
            public static final String NAME_EMPTY = PREFIX + "NAME_EMPTY";
            public static final String LEVEL_DIFFICULTY = PREFIX + "LEVEL_DIFFICULTY";
            public static final String BOARD_EMPTY = PREFIX + "BOARD_EMPTY";
        }

        public static final class INITIATIVE {
            private static final String PREFIX = "ADVENTURE.";

            public static final String NOT_FOUND = PREFIX + "NOT_FOUND";
        }

        public static final class CHARACTER {
            private static final String PREFIX = "CHARACTER.";

            public static final String NAME_EMPTY = PREFIX + "NAME_EMPTY";
            public static final String NOT_FOUND = PREFIX + "NOT_FOUND";
        }

        public static final class MONSTER {
            private static final String PREFIX = "MONSTER.";

            public static final String NOT_FOUND = PREFIX + "NOT_FOUND";
        }

        public static final class CHARACTER_ITEM {
            private static final String PREFIX = "CHARACTER_ITEM.";

            public static final String NOT_FOUND = PREFIX + "NOT_FOUND";
        }

        public static final class USER {
            private static final String PREFIX = "USER.";

            public static final String NOT_FOUND = PREFIX + "NOT_FOUND";
            public static final String NAME_EMPTY = PREFIX + "NAME_EMPTY";
            public static final String ROLE_EMPTY = PREFIX + "ROLE_EMPTY";
            public static final String PASSWORD_EMPTY = PREFIX + "PASSWORD_EMPTY";
        }
    }
}
