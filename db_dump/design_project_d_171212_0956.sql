-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- 생성 시간: 17-12-12 01:56
-- 서버 버전: 10.1.26-MariaDB
-- PHP 버전: 7.1.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 데이터베이스: `design_project_d`
--

-- --------------------------------------------------------

--
-- 테이블 구조 `classroom`
--

CREATE TABLE `classroom` (
  `id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL,
  `capacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `classroom`
--

INSERT INTO `classroom` (`id`, `name`, `capacity`) VALUES
(1, 'B05', 20),
(2, '211-1', 30),
(3, 'B11', 40),
(4, '205', 30),
(5, '221', 35),
(6, '219', 45),
(7, '101', 25),
(8, '102', 15),
(9, '223', 10),
(10, '218', 30),
(11, '136', 35),
(12, '103', 40),
(13, 'B01', 35),
(14, 'B07', 30),
(15, 'B09', 50),
(16, '409', 40),
(17, '220', 20),
(18, '445', 20),
(19, '227', 30),
(20, '226', 30),
(21, '211-2', 30),
(22, 'B06', 40),
(23, '207', 20),
(24, '209', 20),
(25, '509', 30),
(26, '208', 30),
(27, '325-2', 30),
(28, '539', 30),
(29, '333', 50),
(30, '337', 40),
(31, '115', 30),
(32, '117', 20),
(33, '217', 20),
(34, '229', 20),
(35, '211-3', 20),
(36, '309', 20);

-- --------------------------------------------------------

--
-- 테이블 구조 `classroom_rental`
--

CREATE TABLE `classroom_rental` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `classroom_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `rental_start_time` datetime NOT NULL,
  `rental_end_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `classroom_rental_waiting`
--

CREATE TABLE `classroom_rental_waiting` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `classroom_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `rental_start_time` datetime NOT NULL,
  `rental_end_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `equipment`
--

CREATE TABLE `equipment` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `uuid` char(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `equipment_rental`
--

CREATE TABLE `equipment_rental` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `rental_start_time` datetime NOT NULL,
  `rental_end_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `equipment_rental_waiting`
--

CREATE TABLE `equipment_rental_waiting` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `equipment_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `rental_start_time` datetime NOT NULL,
  `rental_end_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `fixture`
--

CREATE TABLE `fixture` (
  `id` int(11) NOT NULL,
  `classroom_id` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `amount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 테이블 구조 `lecture`
--

CREATE TABLE `lecture` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `classroom_id` int(11) NOT NULL,
  `day_of_the_week` int(11) NOT NULL,
  `lecture_start_time` time NOT NULL,
  `lecture_end_time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `lecture`
--

INSERT INTO `lecture` (`id`, `name`, `classroom_id`, `day_of_the_week`, `lecture_start_time`, `lecture_end_time`) VALUES
(1, '컴퓨터공학개론', 11, 1, '13:00:00', '15:45:00'),
(2, '컴퓨터공학개론', 12, 4, '19:00:00', '21:20:00'),
(3, '프로그래밍기초', 13, 20, '13:00:00', '14:50:00'),
(4, '프로그래밍기초', 1, 20, '13:00:00', '14:50:00'),
(5, '프로그래밍기초', 14, 20, '13:00:00', '14:50:00'),
(6, '프로그래밍기초', 14, 10, '13:00:00', '14:50:00'),
(7, '자료구조', 13, 10, '10:30:00', '12:20:00'),
(8, '설계프로젝트B', 13, 1, '14:00:00', '17:50:00'),
(9, '객체지향프로그래밍', 13, 20, '15:00:00', '16:50:00'),
(10, '콘텐츠제작과웹프로그래밍', 13, 8, '18:30:00', '22:20:00'),
(11, '시스템분석및설계', 13, 2, '16:30:00', '17:45:00'),
(12, '데이터베이스', 13, 2, '18:30:00', '22:20:00');

-- --------------------------------------------------------

--
-- 테이블 구조 `member`
--

CREATE TABLE `member` (
  `id` int(11) NOT NULL COMMENT '학번, 사번 등',
  `password` char(64) NOT NULL,
  `type` int(11) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- 테이블의 덤프 데이터 `member`
--

INSERT INTO `member` (`id`, `password`, `type`, `email`) VALUES
(122, '$2a$10$ElN0DVimbWEuKq7rDXHe3.TJ4oZRDBZ3xQnvYHm1hK.LpQx/Gx.fO', 1, 'd@d.d'),
(1234, '$2a$10$yA0qqc9hCSYAsH.UEcmuZegrhG5w23SJVPOxR0r3B27oWJIRk/itO', 1, 'a@a.a'),
(12311, '$2a$10$s5GrboipdB/3grd3hg/l5emIMgpYXAy4hgvOZffE149uYp6ZdZVdW', 1, 'c@c.c'),
(2014104000, '$2a$10$4L7IwF/dxhcTM039.cvZs.RW1QiiuJg4fBlLUvRfDzwGaySf1q7ve', 1, 'b@b.b'),
(2015104189, '$2a$10$qWtLIPJfwvbckQaGWD9q/OePmAtqLhrs8vOp0MONYfBtBfz.mXQqa', 1, 'mihn0621@naver.com');

--
-- 덤프된 테이블의 인덱스
--

--
-- 테이블의 인덱스 `classroom`
--
ALTER TABLE `classroom`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `classroom_rental`
--
ALTER TABLE `classroom_rental`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `classroom_rental_waiting`
--
ALTER TABLE `classroom_rental_waiting`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `equipment_rental`
--
ALTER TABLE `equipment_rental`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `equipment_rental_waiting`
--
ALTER TABLE `equipment_rental_waiting`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `fixture`
--
ALTER TABLE `fixture`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `lecture`
--
ALTER TABLE `lecture`
  ADD PRIMARY KEY (`id`);

--
-- 테이블의 인덱스 `member`
--
ALTER TABLE `member`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- 덤프된 테이블의 AUTO_INCREMENT
--

--
-- 테이블의 AUTO_INCREMENT `classroom`
--
ALTER TABLE `classroom`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
--
-- 테이블의 AUTO_INCREMENT `classroom_rental`
--
ALTER TABLE `classroom_rental`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `classroom_rental_waiting`
--
ALTER TABLE `classroom_rental_waiting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `equipment_rental`
--
ALTER TABLE `equipment_rental`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `equipment_rental_waiting`
--
ALTER TABLE `equipment_rental_waiting`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `fixture`
--
ALTER TABLE `fixture`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 테이블의 AUTO_INCREMENT `lecture`
--
ALTER TABLE `lecture`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
