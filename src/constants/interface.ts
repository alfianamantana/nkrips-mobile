export interface ProfileDetail {
    community: any[]; 
    is_blocked: boolean;
    is_blocker: boolean;
    user: User;
}

export interface UserSummaryResponse {
    total_unread_message: number;
    total_unread_notification: number;
    user: User;
    verified: boolean;
}

export interface User {
    accept_snk_at: string;
    address: string;
    created_at: string;
    date_of_birth: string;
    email: string;
    email_forgot_password_token: string | null;
    email_verification_token: string | null;
    email_verified_at: string | null;
    fcm_token: string | null;
    id: number;
    is_active: boolean;
    is_inactivated: boolean;
    last_socket_id: string;
    mp_bank_acc_branch: string | null;
    mp_bank_acc_name: string | null;
    mp_bank_acc_number: string | null;
    mp_bank_name: string | null;
    name: string;
    phone_number: string;
    profile_banner_url: string | null;
    profile_picture_url: string | null;
    public_hash: string;
    suspended_until: string | null;
    username: string;
}

export interface CommunityData {
    approved: boolean;
    id: number;
    id_community: number;
    id_user: number;
    is_admin: boolean;
    join_approved_at: string;
    join_request_at: string;
    leave_at: string | null;
    otm_id_community: {
        created_at: string;
        deleted_at: string | null;
        id: number;
        id_creator: number;
        logo: string;
        name: string;
        public_identifier: string;
        total_member: string;
    };
}

export interface CommunityMember {
    approved: boolean;
    id: number;
    id_community: number;
    id_user: number;
    is_admin: boolean;
    join_approved_at: string;
    join_request_at: string;
    leave_at: string | null;
    otm_id_user: {
        accept_snk_at: string;
        address: string;
        created_at: string;
        date_of_birth: string;
        email: string;
        email_forgot_password_token: string | null;
        email_verification_token: string | null;
        email_verified_at: string | null;
        fcm_token: string | null;
        id: number;
        is_active: boolean;
        is_inactivated: boolean;
        last_socket_id: string;
        mp_bank_acc_branch: string | null;
        mp_bank_acc_name: string | null;
        mp_bank_acc_number: string | null;
        mp_bank_name: string | null;
        name: string;
        phone_number: string;
        profile_banner_url: string | null;
        profile_picture_url: string | null;
        public_hash: string;
        suspended_until: string | null;
        username: string;
    };
}

export interface MessageData {
  data: string;
  id: number;
  id_community_to: number | null;
  id_community_topic_to: number | null;
  id_message_reply_to: number | null;
  id_user_from: number;
  id_user_to: number;
  is_deleted: boolean;
  is_edited: boolean;
  is_latest_message: boolean;
  is_pinned: boolean;
  otm_id_message_reply_to: MessageData | null;
  otm_id_user_from: User;
  otm_id_user_to: User;
  pinned_until: string | null;
  ts: string;
}

export interface Attachment {
  id?: number;
  type?: string;
  url?: string;
  filename?: string;
  [key: string]: any;
}


export interface ChatItem {
  list_attachment: Attachment[];
  message: MessageData;
}