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
        }

        public static final class ADVENTURE {
            private static final String PREFIX = "CAMPAIGN.";

            public static final String NOT_FOUND = PREFIX + "NOT_FOUND";
            public static final String LAYER_ITEM_NOT_FOUND = PREFIX + "LAYER_ITEM_NOT_FOUND";
        }

        public static final class USER {
            private static final String PREFIX = "USER.";

            public static final String NOT_FOUND = PREFIX + "NOT_FOUND";
        }
    }
}
