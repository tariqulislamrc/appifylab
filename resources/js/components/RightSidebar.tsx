interface Friend {
    name: string;
    role: string;
    img: string;
    online: boolean;
    lastSeen?: string;
}

const FRIENDS: Friend[] = [
    { name: 'Steve Jobs', role: 'CEO of Apple', img: '/assets/images/people1.png', online: false, lastSeen: '5 minute ago' },
    { name: 'Ryan Roslansky', role: 'CEO of Linkedin', img: '/assets/images/people2.png', online: true },
    { name: 'Dylan Field', role: 'CEO of Figma', img: '/assets/images/people3.png', online: true },
    { name: 'Steve Jobs', role: 'CEO of Apple', img: '/assets/images/people1.png', online: false, lastSeen: '5 minute ago' },
    { name: 'Ryan Roslansky', role: 'CEO of Linkedin', img: '/assets/images/people2.png', online: true },
    { name: 'Dylan Field', role: 'CEO of Figma', img: '/assets/images/people3.png', online: false, lastSeen: '5 minute ago' },
];

export default function RightSidebar() {
    return (
        <div className="_layout_right_sidebar_wrap">
            {/* You Might Like */}
            <div className="_layout_right_sidebar_inner">
                <div className="_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                    <div className="_right_inner_area_info_content _mar_b24">
                        <h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4>
                        <span className="_right_inner_area_info_content_txt">
                            <a className="_right_inner_area_info_content_txt_link" href="#0">See All</a>
                        </span>
                    </div>
                    <hr className="_underline" />
                    <div className="_right_inner_area_info_ppl">
                        <div className="_right_inner_area_info_box">
                            <div className="_right_inner_area_info_box_image">
                                <img src="/assets/images/Avatar.png" alt="Radovan" className="_ppl_img" />
                            </div>
                            <div className="_right_inner_area_info_box_txt">
                                <h4 className="_right_inner_area_info_box_title">Radovan SkillArena</h4>
                                <p className="_right_inner_area_info_box_para">Founder &amp; CEO at Trophy</p>
                            </div>
                        </div>
                        <div className="_right_info_btn_grp">
                            <button type="button" className="_right_info_btn_link">Ignore</button>
                            <button type="button" className="_right_info_btn_link _right_info_btn_link_active">Follow</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Friends */}
            <div className="_layout_right_sidebar_inner">
                <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                    <div className="_feed_top_fixed">
                        <div className="_feed_right_inner_area_card_content _mar_b24">
                            <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
                            <span className="_feed_right_inner_area_card_content_txt">
                                <a className="_feed_right_inner_area_card_content_txt_link" href="#0">See All</a>
                            </span>
                        </div>
                        <form className="_feed_right_inner_area_card_form" onSubmit={(e) => e.preventDefault()}>
                            <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                                <circle cx="7" cy="7" r="6" stroke="#666" />
                                <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                            </svg>
                            <input className="form-control me-2 _feed_right_inner_area_card_form_inpt" type="search" placeholder="Search..." />
                        </form>
                    </div>
                    <div className="_feed_bottom_fixed">
                        {FRIENDS.map(({ name, role, img, online, lastSeen }, idx) => (
                            <div key={idx} className={`_feed_right_inner_area_card_ppl${!online ? ' _feed_right_inner_area_card_ppl_inactive' : ''}`}>
                                <div className="_feed_right_inner_area_card_ppl_box">
                                    <div className="_feed_right_inner_area_card_ppl_image">
                                        <img src={img} alt={name} className="_box_ppl_img" />
                                    </div>
                                    <div className="_feed_right_inner_area_card_ppl_txt">
                                        <h4 className="_feed_right_inner_area_card_ppl_title">{name}</h4>
                                        <p className="_feed_right_inner_area_card_ppl_para">{role}</p>
                                    </div>
                                </div>
                                <div className="_feed_right_inner_area_card_ppl_side">
                                    {online ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
                                            <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
                                        </svg>
                                    ) : (
                                        <span>{lastSeen}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
