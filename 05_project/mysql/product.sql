use dev;

DROP TABLE IF EXISTS `t_category`;
CREATE TABLE `t_category` (
`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
`category1` varchar(100) NOT NULL DEFAULT '',
`category2` varchar(100) NOT NULL DEFAULT '',
`category3` varchar(100) DEFAULT '',
PRIMARY KEY(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_image`;
CREATE TABLE `t_image` (
`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
`product_id` int(11) unsigned NOT NULL,
`type` int(1) NOT NULL DEFAULT 1 COMMENT '1-썸네일, 2-제품이미지, 3-제품설명이미지',
`path` varchar(150) NOT NULL DEFAULT '',
PRIMARY KEY(`id`),
KEY `product_id` (`product_id`),
CONSTRAINT `t_image_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `t_product`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_product`;
CREATE TABLE `t_product` (
`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
`product_name` varchar(200) NOT NULL DEFAULT '',
`product_price` int(11) NOT NULL DEFAULT 0,
`delivery_price` int(11) NOT NULL DEFAULT 0,
`add_delivery_price` int(11) NOT NULL DEFAULT 0,
`tags` varchar(100) DEFAULT NULL,
`outbound_days` int(2) NOT NULL DEFAULT 5,
`seller_id` int(11) unsigned NOT NULL DEFAULT 0,
`category_id` int(11) unsigned NOT NULL DEFAULT 0,
`active_yn` enum('Y','N') NOT NULL DEFAULT 'Y',
`created_date` datetime NOT NULL DEFAULT current_timestamp(),
PRIMARY KEY (`id`),
KEY `seller_id` (`seller_id`),
KEY `category_id` (`category_id`),
CONSTRAINT `t_product_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `t_seller`(`id`),
CONSTRAINT `t_product_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `t_category`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

alter table t_product alter column seller_id set default 0;
alter table t_product alter column category_id set default 0;

DROP TABLE IF EXISTS `t_seller`;
CREATE TABLE `t_seller` (
`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
`name` VARCHAR(100) NOT NULL DEFAULT '',
`email` VARCHAR(100) NOT NULL DEFAULT '',
`phone` VARCHAR(20) NOT NULL DEFAULT '',
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
`email` varchar(50) NOT NULL DEFAULT '',
`type` int(1) NOT NULL DEFAULT 1 COMMENT '1-buyer, 2-seller',
`nickname` varchar(50) DEFAULT NULL,
PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- auto_increment초기화
alter table `t_image` auto_increment = 1;


-- 상품(product), 카테고리(category), 이미지(image)

-- 카테고리 데이터 삽입
select *
from t_category;
insert into t_category (category1,category2, category3)
values('컴퓨터', '주요부품', '메인보드');
insert into t_category (category1,category2, category3)
values('컴퓨터', '주변기기', '마우스');


-- seller 테이블 삽입
select *
from t_seller;
insert into t_seller (name, email, phone)
values ('seller01', 'seller01@email.com', '010-0000-0000');


-- product 상품데이터 입력
select *
from t_product;
insert into t_product(product_name, product_price, delivery_price, seller_id, category_id)
values('lg 마우스',15000,3000,1,2);

insert into t_product(product_name, product_price, delivery_price, seller_id, category_id)
values('logitec 마우스',18000,3000,1,2);


select concat(c.category1,'/',c.category2,'/',c.category3) -- concat -> 문장연결 mysql 함수
        as category,
        p.id,
        p.product_name,
        p.delivery_price,
        i.*
from t_product p
join t_category c       
on p.category_id = c.id
join t_image i
on p.id = i.product_id
and i.type = 1  -- 메인이미지
where p.product_name = 'lg마우스';


-- image 이미지 테이블 삽입
select *
from t_image;

select *
from t_product;

insert into t_image (product_id, type, path)
values(2, 1, 'upload/2/thumbnail1.jpg');
insert into t_image (product_id, type, path)
values(3, 1, 'upload/3/thumbnail2.jpg');


-- user 관련
select *
from t_user;