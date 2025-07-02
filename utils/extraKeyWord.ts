export function extractNotes(data: any[]) {
  return data
    .filter((item) => item.model_type === 'note' && item.note_card)
    .map((item) => {
      const card = item.note_card;
      // 发布时间
      let publish_time = '';
      let homeLink = `https://www.xiaohongshu.com/user/profile/${card.user.user_id}?xsec_token=${item.xsec_token}&xsec_source=pc_note`;
      let noteLink = `https://www.xiaohongshu.com/explore/${item.id}?xsec_token=${item.xsec_token}&source=web_explore_feed`;
      if (Array.isArray(card.corner_tag_info)) {
        const tag = card.corner_tag_info.find(
          (t: any) => t.type === 'publish_time'
        );
        publish_time = tag ? tag.text : '';
      }
      return {
        id: item.id || '',
        title: card.display_title || '',
        nickname: card.user?.nickname || card.user?.nick_name || '',
        publish_time,
        liked_count: card.interact_info?.liked_count || 0,
        comment_count: card.interact_info?.comment_count || 0,
        collected_count: card.interact_info?.collected_count || 0,
        shared_count: card.interact_info?.shared_count,
        cover: card.cover?.url_default || '',
        homeLink,
        noteLink,
      };
    });
}
